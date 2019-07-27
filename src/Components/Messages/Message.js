import React from "react";
import { Comment, Icon, Image } from "semantic-ui-react";
import moment from "moment";

const Message = props => {
  const isOwnMessage = (message, user) => {
    return message.user.id === user.currentUser.uid ? "message__self" : "";
  };

  const timeFromNow = timestamp => {
    return moment(timestamp).fromNow();
  };

  const isImage = msg => {
    return msg.hasOwnProperty("image") && !msg.hasOwnProperty("content");
  };

  return (
    <Comment>
      <Comment.Avatar src={props.message.user.avatar} />
      <Comment.Content className={isOwnMessage(props.message, props.user)}>
        <Comment.Author as="a">{props.message.user.name}</Comment.Author>
        <Comment.Metadata>
          {timeFromNow(props.message.timestamp)}
        </Comment.Metadata>
        {isImage(props.message) ? (
          <Image src={props.message.image} className="messages__image" />
        ) : (
          <Comment.Text>{props.message.content}</Comment.Text>
        )}
      </Comment.Content>
    </Comment>
  );
};

export default Message;
