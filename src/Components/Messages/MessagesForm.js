import React from "react";
import uuidv4 from "uuid/v4";
import { Segment, Input, Button, Form } from "semantic-ui-react";
import { useSelector } from "react-redux";
import firebase from "../../firebase";
import FileModal from "./FileModal";
import ProgressBar from "./ProgressBar";

const MessagesForm = props => {
  const [messages, setMessage] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [channel, setChannel] = React.useState(null);
  const [err, setErr] = React.useState(null);
  const [modal, setModal] = React.useState(false);

  const [percertage, setPercentage] = React.useState(0);
  const [uploadErr, setUploadErr] = React.useState([]);
  const [uploadState, setUploadState] = React.useState("");
  const [uploadTask, setUploadTask] = React.useState(null);
  const [storageRef, setStorageRef] = React.useState(firebase.storage().ref());

  const openModal = () => {
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
  };

  const channelState = useSelector(state => {
    return state.channel.currentChannel;
  });

  const userState = useSelector(state => {
    return state.user.currentUser;
  });

  const createMessage = (fileUrl = null) => {
    const message = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: userState.uid,
        name: userState.displayName,
        avatar: userState.photoURL
      }
    };

    if (fileUrl !== null) {
      message["image"] = fileUrl;
    } else {
      message["content"] = messages;
    }

    return message;
  };

  const sendFileMessage = (fileurl, ref, pathToUpload) => {
    ref
      .child(pathToUpload)
      .push()
      .set(createMessage(fileurl))
      .then(() => {
        setUploadState("done");
      })
      .catch(err => {
        console.log(err);
        setUploadErr(prev => prev.concat(err));
      });
  };

  React.useEffect(() => {
    let pathToUpload = "";
    if (channelState) {
      pathToUpload = channelState.id;
    }
    const ref = props.messagesRef;
    const filePath = `chat/public/${uuidv4()}.jpg`;
    const uploadFile = (file, metadata) => {
      setUploadState("uploading");
      setUploadTask(storageRef.child(filePath).put(file, metadata));
    };
    if (uploadTask) {
      uploadTask.on(
        "state_changed",
        snap => {
          const percentUploaded = Math.round(
            (snap.bytesTransferred / snap.totalBytes) * 100
          );

          setPercentage(percentUploaded);
        },
        err => {
          console.log(err);
          setUploadErr(prev => {
            prev.concat(err);
          });
          setUploadState("Error");
          setUploadTask(null);
        },
        () => {
          uploadTask.snapshot.ref
            .getDownloadURL()
            .then(downloadURL => {
              setUploadState("done");
              sendFileMessage(downloadURL, ref, pathToUpload);
            })
            .catch(err => {
              console.log(err);
              setUploadErr(prev => {
                prev.concat(err);
              });
              setUploadState("Error");
              setUploadTask(null);
            });
        }
      );
    }
  }, [uploadTask]);

  const uploadFile = (file, metadata) => {
    const pathToUpload = channelState.id;
    const ref = props.messagesRef;
    const filePath = `chat/public/${uuidv4()}.jpg`;

    setUploadState("uploading");
    setUploadTask(storageRef.child(filePath).put(file, metadata));
  };

  const sendMessage = () => {
    if (messages) {
      setLoading(true);
      setErr();
      props.messagesRef
        .child(channelState.id)
        .push()
        .set(createMessage())
        .then(() => {
          const objDiv = document.getElementById("divID");
          objDiv.scrollTop = objDiv.scrollHeight;
          setLoading(false);
          setMessage("");
        })
        .catch(err => {
          setLoading(false);
          console.log(err);
          console.log(err);
          setErr([err]);
        });
    } else {
      console.log("add a message");
      setErr("Add a message");
    }
  };

  return (
    <Segment className="message__form">
      <Form onSubmit={sendMessage}>
        <Input
          onChange={e => setMessage(e.target.value)}
          fluid
          value={messages}
          className={err && "error"}
          name="message"
          style={{ marginBottom: "0.7em" }}
          label={<Button icon="add" />}
          labelPosition="left"
          placeholder="Write your message"
        />
        <Button.Group icon widths="2">
          <Button
            disabled={loading}
            color="orange"
            content="Add Message"
            type="submit"
            labelPosition="left"
            icon="edit"
          />
          <Button
            disabled={uploadState === "uploading"}
            color="teal"
            type="button"
            onClick={openModal}
            content="Upload Media"
            labelPosition="right"
            icon="cloud upload"
          />
        </Button.Group>
        <ProgressBar uploadState={uploadState} percentUploaded={percertage} />
        <FileModal
          uploadFile={uploadFile}
          modal={modal}
          closeModal={closeModal}
        />
      </Form>
    </Segment>
  );
};

export default MessagesForm;
