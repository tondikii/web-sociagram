import type {NextComponentType, NextPageContext} from "next";

interface Props {}

const Chat: NextComponentType<NextPageContext, {}, Props> = (props: Props) => {
  return <div>chat page</div>;
};

export default Chat;
