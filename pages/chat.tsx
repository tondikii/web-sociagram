import type {NextComponentType, NextPageContext} from "next";
import styles from "../styles/Chat.module.css";
import ChatCard from "../components/ChatCard";
import {useEffect, useRef, useState} from "react";

import {ChatAlt2Icon, PencilAltIcon} from "@heroicons/react/outline";
import ButtonPrimary from "../components/ButtonPrimary";
import ModalSearch from "../components/ModalSearch";
import {useToggle} from "../hooks";
import {Avatar} from "@mui/material";
import {useSelector} from "react-redux";
import {useRouter} from "next/router";

import {io} from "socket.io-client";
import {Message, User} from "../props";
import useFetch from "../hooks/useFetch";
import {fetchChatApi} from "../store/api";

const socket: any = io("http://localhost:3003");

interface Props {}
interface Chat {
  User: User;
  messages: Message[] | [];
}

const ChatPage: NextComponentType<NextPageContext, {}, Props> = (
  props: Props
) => {
  const router = useRouter();

  const session = useSelector(
    (state: {
      rootReducer: {
        session: {id: number; username: string; avatar: string; name: string};
      };
    }) => state?.rootReducer?.session
  );
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [selectedChatIndex, setSelectedChatIndex] = useState<number>(-1);
  const [modalSearch, toggleModalSearch]: any[] = useToggle();
  const [chat, setChat] = useState<Chat[]>([]);
  useEffect(() => {
    console.log({chat});
  }, [chat]);
  const [message, setMessage] = useState<string>("");

  const {
    data: fetchedChat,
  }: {
    data: any;
  } = useFetch({
    api: fetchChatApi,
    payload: {data: session.id},
    prevent: !session.id,
  });

  useEffect(() => {
    if (fetchedChat) {
      setChat([...chat, ...fetchedChat]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchedChat]);

  const selectedChat: Chat | undefined = chat[selectedChatIndex];

  const onClickChatCard = (idx: number) => {
    setSelectedChatIndex(idx);
  };

  const onClickUserSearched = (user: User) => {
    setChat([{User: user, messages: []}, ...chat]);
    setSelectedChatIndex(0);
  };

  const useAutosizeTextArea = (
    textAreaRef: HTMLTextAreaElement | null,
    value: string
  ) => {
    useEffect(() => {
      if (textAreaRef) {
        // We need to reset the height momentarily to get the correct scrollHeight for the textarea
        textAreaRef.style.height = "0px";
        const scrollHeight = textAreaRef.scrollHeight;

        // We then set the height directly, outside of the render loop
        // Trying to set this with state or a ref will product an incorrect value.
        textAreaRef.style.height = scrollHeight + "px";
      }
    }, [textAreaRef, value]);
  };
  useAutosizeTextArea(textAreaRef.current, message);

  const onChangeChat = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e?.target?.value);
  };

  const onSendChat = () => {
    if (message.trim() !== "" && selectedChat) {
      const userIdReceiver: number = selectedChat.User?.id;
      console.log("emit chat", {
        userIdReceiver,
        message,
        usernameReceiver: selectedChat.User?.username,
        nameReceiver: selectedChat.User?.name,
        avatarReceiver: selectedChat.User?.avatar,
      });

      socket.emit("chat_message", {
        userIdReceiver,
        message,
        username: session?.username,
        name: session?.name,
        avatar: session?.avatar,
        usernameReceiver: selectedChat.User?.username,
        nameReceiver: selectedChat.User?.name,
        avatarReceiver: selectedChat.User?.avatar,
      });
      const prevChat: Chat[] = [...chat];
      prevChat[selectedChatIndex].messages = [
        ...prevChat[selectedChatIndex]?.messages,
        {UserId: session.id, UserIdReceiver: userIdReceiver, message},
      ];
      console.log("onSendChat", {prevChat});
      setChat(prevChat);
      setMessage("");
    }
  };

  useEffect(() => {
    if (session?.id) {
      console.log("SET ID", session);
      socket.emit("set_id", session?.id);
      // Listen for incoming messages
      socket.on("chat_message", (msg: any) => {
        console.log({msg});
        const prevChat: Chat[] = [...chat];
        const foundIndex = chat.findIndex((e) => e?.User?.id === msg?.UserId);
        if (foundIndex >= 0) {
          prevChat[foundIndex].messages = [
            ...prevChat[foundIndex].messages,
            msg,
          ];
        } else {
          prevChat.unshift(msg);
        }
        setChat(prevChat);
      });
    }

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  return (
    <>
      <ModalSearch
        open={modalSearch}
        toggle={toggleModalSearch}
        onClickUser={onClickUserSearched}
      />
      <div className="w-screen flex flex-col items-end">
        <div className={styles.container}>
          <div className={styles.messageBar}>
            <div className={styles.topMessageBar}>
              <span className="text-lg font-semibold">Messages</span>
              <PencilAltIcon
                className="h-6 w-6"
                role="button"
                onClick={toggleModalSearch}
              />
            </div>
            {Array.isArray(chat) && chat.length > 0
              ? chat.map((e, idx) => (
                  <ChatCard
                    data={e}
                    UserId={session.id}
                    key={idx}
                    onClick={() => {
                      onClickChatCard(idx);
                    }}
                    isSelected={selectedChatIndex === idx}
                  />
                ))
              : null}
          </div>
          <div
            className={`w-8/12 h-screen flex flex-col justify-${
              selectedChat ? "between" : "center"
            } items-center`}
          >
            {selectedChat ? (
              <>
                <div
                  className={styles.topChatContainer}
                  role="button"
                  onClick={() => {
                    const {username} = chat[selectedChatIndex].User;
                    if (username) {
                      router.push(username);
                    }
                  }}
                >
                  <Avatar
                    className="rounded-full w-14 h-14 mr-4"
                    src={
                      chat[selectedChatIndex]?.User?.avatar ||
                      "https://trimelive.com/wp-content/uploads/2020/12/gambar-Wa-1.png"
                    }
                  />
                  <span className="font-semibold">
                    {chat[selectedChatIndex]?.User?.name}
                  </span>
                </div>
                <div className={styles.chatContainer}>
                  {selectedChat.messages.map((e: Message, idx: number) => {
                    console.log("SEBELAH SINI", e);
                    const isSelf = e.UserId === session.id;
                    const placement = isSelf ? "end" : "start";
                    const color = isSelf ? "fuchsia-600" : "zinc-800";
                    const roundedSide = isSelf
                      ? "rounded-l-3xl rounded-tr-3xl"
                      : "rounded-r-3xl rounded-tl-3xl";
                    return (
                      <div
                        key={idx + 1}
                        className={`self-${placement} bg-${color} ${roundedSide} p-4`}
                      >
                        <span>{e.message}</span>
                      </div>
                    );
                  })}
                </div>
                <div className={styles.bottomChatContainer}>
                  <div className="horizontal justify-between p-4 border border-zinc-200 dark:border-zinc-800 rounded-3xl">
                    <textarea
                      placeholder="Write a message..."
                      className={styles.textarea}
                      onChange={onChangeChat}
                      ref={textAreaRef}
                      rows={1}
                      maxLength={255}
                    />
                    <span
                      className={`${
                        message?.length ? "text-primary" : "text-zinc-400"
                      } font-semibold`}
                      role="button"
                      onClick={onSendChat}
                    >
                      Send
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <ChatAlt2Icon className="text-primary h-16 w-16 mb-4" />
                <span className="text-xl">Your messages</span>
                <span className="text-zinc-400 mb-4">
                  Send messages to a friend
                </span>
                <ButtonPrimary
                  text="Send message"
                  onClick={toggleModalSearch}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatPage;
