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

interface Props {}

const Chat: NextComponentType<NextPageContext, {}, Props> = (props: Props) => {
  const router = useRouter();

  const ownUserId = useSelector(
    (state: {rootReducer: {session: {id: number}}}) =>
      state?.rootReducer?.session?.id
  );
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [selectedChatIndex, setSelectedChatIndex] = useState<number>(0);
  const [modalSearch, toggleModalSearch]: any[] = useToggle();
  const [messages, setMessages] = useState<any[]>([
    {
      avatar:
        "https://ik.imagekit.io/fnzl2pmmqv2d/Photo_on_12-11-22_at_19.24_z_GsxPSJQ.jpg",
      bio: "Aku sayang dika",
      createdAt: "2023-04-26T08:41:07.024Z",
      email: "kaniadewi26@gmail.com",
      gender: "female",
      id: 2,
      message: "text message",
      name: "Kania Dika",
      updatedAt: "2023-06-12T15:39:06.877Z",
      username: "kaniadewist",
    },
  ]);
  const [chat, setChat] = useState("");

  const isAnySelected = selectedChatIndex >= 0;

  const onClickChatCard = (idx: number) => {
    setSelectedChatIndex(idx);
  };

  const onClickUser = (user: any) => {
    const foundUser = messages.find((e) => e?.id === user?.id);
    if (!foundUser && user?.id !== ownUserId) {
      setMessages([{...user, message: "text message"}, ...messages]);
    }
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
  useAutosizeTextArea(textAreaRef.current, chat);

  const handleChangeCaption = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setChat(e?.target?.value);
  };

  return (
    <>
      <ModalSearch
        open={modalSearch}
        toggle={toggleModalSearch}
        onClickUser={onClickUser}
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
            {Array.isArray(messages) && messages.length > 0
              ? messages.map((e, idx) => (
                  <ChatCard
                    data={e}
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
              isAnySelected ? "between" : "center"
            } items-center`}
          >
            {isAnySelected ? (
              <>
                <div
                  className={styles.topChatContainer}
                  role="button"
                  onClick={() => {
                    const {username} = messages[selectedChatIndex];
                    if (username) {
                      router.push(username);
                    }
                  }}
                >
                  <Avatar
                    className="rounded-full w-14 h-14 mr-4"
                    src={messages[selectedChatIndex]?.avatar}
                  />
                  <span className="font-semibold">
                    {messages[selectedChatIndex]?.name}
                  </span>
                </div>
                <div className={styles.chatContainer}>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(() => (
                    <>
                      <div className="self-end bg-fuchsia-600 rounded-l-3xl rounded-tr-3xl p-4">
                        <span>lebih suka law atau zoro?</span>
                      </div>
                      <div className="self-start bg-zinc-800 rounded-r-3xl rounded-tl-3xl  p-4">
                        <span>zoro</span>
                      </div>
                    </>
                  ))}
                </div>
                <div className={styles.bottomChatContainer}>
                  <div className="horizontal justify-between p-4 border border-zinc-200 dark:border-zinc-800 rounded-3xl">
                    <textarea
                      placeholder="Write a message..."
                      className={styles.textarea}
                      onChange={handleChangeCaption}
                      ref={textAreaRef}
                      rows={1}
                      maxLength={255}
                    />
                    <span
                      className={`${
                        chat?.length ? "text-primary" : "text-zinc-400"
                      } font-semibold`}
                      role="button"
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

export default Chat;
