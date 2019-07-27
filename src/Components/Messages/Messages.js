import React from "react";
import { Segment, Comment, Loader } from "semantic-ui-react";
import MessagesHeader from "./MessagesHeader";
import MessagesForm from "./MessagesForm";
import firebase from "../../firebase";
import { useSelector } from "react-redux";
import Message from "./Message";

const Messages = props => {
  const [messagesLoading, setMessagesLoading] = React.useState(true);
  const [messages, setMessages] = React.useState([]);
  const messagesRef = firebase.database().ref("messages");
  const [uniqueUsers, setUniqueUsers] = React.useState(0);

  const channelState = useSelector(state => {
    return state.channel.currentChannel;
  });
  const userState = useSelector(state => {
    return state.user;
  });

  let channelName = () => (channelState ? `#${channelState.name}` : "");

  const addMessagesListeners = channelId => {
    let a = [];
    setMessages([]);
    setMessagesLoading(false);
    messagesRef.child(channelId).on("child_added", snap => {
      setMessagesLoading(false);
      a.push(snap.val());
      countUniqueUsers(a);
      return setMessages(prev => [...a]);
    });
  };

  const countUniqueUsers = messages => {
    const uniqueUsers = messages.reduce((acc, msg) => {
      if (!acc.includes(msg.user.name)) {
        acc.push(msg.user.name);
      }
      return acc;
    }, []);
    const numUniqueUsers = `${uniqueUsers.length} users`;
    setUniqueUsers(numUniqueUsers);
  };

  const addListeners = channelId => {
    addMessagesListeners(channelId);
  };

  React.useEffect(() => {
    if (userState && channelState) {
      addListeners(channelState.id);
    }
  }, [channelState]);

  //channelState

  const displayMessages = () => {
    if (messages.length > 0) {
      return messages.map(msg => {
        return <Message key={msg.timestamp} message={msg} user={userState} />;
      });
    }
  };

  return (
    <>
      <MessagesHeader users={uniqueUsers} channelName={channelName()} />
      <Segment>
        <Loader active={messagesLoading} />
        <Comment.Group
          style={{ margin: "auto" }}
          id="divID"
          className="messages"
        >
          {displayMessages()}
        </Comment.Group>
      </Segment>
      <MessagesForm messagesRef={messagesRef} />
    </>
  );
};

export default Messages;
