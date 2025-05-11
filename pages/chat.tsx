import type {NextComponentType, NextPageContext} from "next";
import styles from "../styles/Chat.module.css";
import ChatCard from "../components/ChatCard";
import {useEffect, useRef, useState} from "react";

import {
  ChatAlt2Icon,
  PencilAltIcon,
  ArrowLeftIcon,
} from "@heroicons/react/outline";
import ButtonPrimary from "../components/ButtonPrimary";
import ModalSearch from "../components/ModalSearch";
import {useToggle} from "../hooks";
import {Avatar} from "@mui/material";
import {useSelector} from "react-redux";
import {useRouter} from "next/router";

import {Message, User} from "../props";
import useFetch from "../hooks/useFetch";
import {fetchChatApi} from "../store/api";
import moment from "moment";

import {supabase} from "../lib/supabaseClient";

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
  const [refetchChat, setRefetchChat] = useState<boolean>(false);
  const [showChatList, setShowChatList] = useState<boolean>(true);

  const {
    data: fetchedChat,
  }: {
    data: any;
  } = useFetch({
    api: fetchChatApi,
    payload: {data: session.id},
    prevent: !session.id,
    refetch: refetchChat,
    setRefetch: setRefetchChat,
  });

  useEffect(() => {
    if (fetchedChat) {
      setChat([...fetchedChat]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchedChat]);

  const selectedChat: Chat | undefined = chat[selectedChatIndex];

  const onClickChatCard = (idx: number) => {
    setSelectedChatIndex(idx);
    // On mobile, hide the chat list when selecting a chat
    if (window.innerWidth < 768) {
      setShowChatList(false);
    }
  };

  const onClickUserSearched = (user: User) => {
    setChat([{User: user, messages: []}, ...chat]);
    setSelectedChatIndex(0);
    // On mobile, hide the chat list when selecting a chat
    if (window.innerWidth < 768) {
      setShowChatList(false);
    }
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

  const onChangeMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e?.target?.value);
  };

  const onSendChat = async () => {
    if (message.trim() !== "" && selectedChat) {
      const {
        id: userIdReceiver,
        username: usernameReceiver,
        name: nameReceiver,
        avatar: avatarReceiver,
      } = selectedChat.User;

      const {error} = await supabase.from("UserChats").insert([
        {
          UserId: session.id,
          UserIdReceiver: userIdReceiver,
          usernameReceiver,
          nameReceiver,
          avatarReceiver,
          message,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);

      if (!error) {
        const prevChat: Chat[] = [...chat];
        prevChat[selectedChatIndex].messages = [
          ...prevChat[selectedChatIndex]?.messages,
          {
            UserId: session.id,
            UserIdReceiver: userIdReceiver,
            message,
            createdAt: new Date().toISOString(),
          },
        ];
        setChat(prevChat);
        setMessage("");
      }
    }
  };

  useEffect(() => {
    const channel = supabase
      .channel(`chat:user:${session.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "UserChats",
          filter: `UserIdReceiver=eq.${session.id}`,
        },
        () => {
          setRefetchChat(true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session.id]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({behavior: "smooth"});
    }
  }, [selectedChat?.messages?.length]);

  // Auto-hide chat list on mobile when a chat is selected
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        // md breakpoint in Tailwind
        setShowChatList(chat.length === 0 || !selectedChat);
      } else {
        setShowChatList(true);
      }
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [chat.length, selectedChat]);

  return (
    <>
      <ModalSearch
        open={modalSearch}
        toggle={toggleModalSearch}
        onClickUser={onClickUserSearched}
      />
      <div className="w-screen flex flex-col items-center">
        <div className={styles.container}>
          {showChatList && (
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
          )}

          <div
            className={`${styles.chatSection} text-sm md:text-md lg:text-lg`}
          >
            {selectedChat ? (
              <>
                <div className={styles.topChatContainer}>
                  <div className="flex flex-row items-center w-full">
                    {!showChatList && (
                      <ArrowLeftIcon
                        className="h-6 w-6 mr-4 md:hidden"
                        role="button"
                        onClick={() => setShowChatList(true)}
                      />
                    )}
                    <div
                      className="flex flex-row items-center flex-grow"
                      role="button"
                      onClick={() => {
                        const {username} = chat[selectedChatIndex].User;
                        if (username) {
                          router.push(username);
                        }
                      }}
                    >
                      <Avatar
                        className="rounded-full w-10 h-10 md:w-14 md:h-14 mr-3 md:mr-4"
                        src={
                          chat[selectedChatIndex]?.User?.avatar ||
                          "https://trimelive.com/wp-content/uploads/2020/12/gambar-Wa-1.png"
                        }
                      />
                      <span className="font-semibold truncate">
                        {chat[selectedChatIndex]?.User?.name}
                      </span>
                    </div>
                  </div>
                </div>
                <div className={styles.chatContainer}>
                  {selectedChat.messages.map((e: Message, idx) => {
                    const isSelf = e.UserId === session.id;
                    const conditionalClass = isSelf
                      ? "self-end bg-fuchsia-600 rounded-l-3xl rounded-tr-3xl"
                      : "self-start bg-zinc-800 rounded-r-3xl rounded-tl-3xl ";
                    const className = `${conditionalClass} p-3 md:p-4 mt-2 flex flex-col max-w-[80%]`;
                    return (
                      <div
                        key={idx + 1}
                        className={className}
                        ref={
                          idx === selectedChat?.messages?.length - 1
                            ? chatEndRef
                            : null
                        }
                      >
                        <span className="break-words">{e.message}</span>
                        <span className="text-xs text-neutral-400 text-end">
                          {moment(e.createdAt).format("D MMM hh:mm")}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className={styles.bottomChatContainer}>
                  <div className="horizontal justify-between p-3 md:p-4 border border-zinc-200 dark:border-zinc-800 rounded-3xl">
                    <textarea
                      placeholder="Write a message..."
                      className={styles.textarea}
                      onChange={onChangeMessage}
                      ref={textAreaRef}
                      value={message}
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
                <div className="flex flex-col items-center justify-center h-screen">
                  <ChatAlt2Icon className="text-primary h-16 w-16 mb-4" />
                  <span className="text-xl">Your messages</span>
                  <span className="text-zinc-400 mb-4 text-center px-4">
                    Send messages to a friend
                  </span>
                  <ButtonPrimary
                    text="Send message"
                    onClick={toggleModalSearch}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatPage;
