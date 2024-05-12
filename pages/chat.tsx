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

const socket: any = io(
  "http://localhost:3002"
  // process.env.NODE_ENV === "production"
  //   ? "https://be-sociagram.vercel.app"
  //   : "http://localhost:3002"
);

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
  const [selectedChatIndex, setSelectedChatIndex] = useState<number>(0);
  const [modalSearch, toggleModalSearch]: any[] = useToggle();
  const [chat, setChat] = useState<Chat[]>([]);
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
      setChat(prevChat);
      setMessage("");
    }
  };

  useEffect(() => {
    if (session?.id) {
      socket.emit("set_id", session?.id);

      // Listen for incoming messages
      socket.on("chat_message", (msg: any) => {
        setChat((prevChat) => {
          const newPrevChat: Chat[] = [...prevChat];

          const foundIndex = newPrevChat.findIndex(
            (e) => e?.User.id === msg?.UserId
          );

          if (foundIndex >= 0) {
            newPrevChat[foundIndex].messages = [
              ...newPrevChat[foundIndex].messages,
              msg?.messages?.[0],
            ];
          } else {
            newPrevChat.unshift(msg);
          }
          return newPrevChat;
        });
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
                  {selectedChat.messages.map((e: Message, idx) => {
                    const isSelf = e.UserId === session.id;
                    const className = isSelf
                      ? "self-end bg-fuchsia-600 rounded-l-3xl rounded-tr-3xl p-4 mt-2"
                      : "self-start bg-zinc-800 rounded-r-3xl rounded-tl-3xl  p-4 mt-2";
                    return (
                      <div key={idx + 1} className={className}>
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
