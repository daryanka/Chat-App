import React from "react";
import firebase from "../../firebase";
import { Menu, Icon, Modal, Form, Input, Button } from "semantic-ui-react";
import { setCurrentChannel } from "../../Actions/index";
import { useDispatch } from "react-redux";

const Channels = props => {
  const dispatch = useDispatch();
  const [channels, setChannels] = React.useState([]);
  const [modal, setModal] = React.useState(false);
  const [channelName, setChannelName] = React.useState("");
  const [channelDesc, setChannelDesc] = React.useState("");
  const [firstLoad, setFirstLoad] = React.useState(true);
  const [activeChannel, setActiveChannel] = React.useState("");

  const closeModal = () => {
    setModal(false);
  };
  const openModal = () => {
    setModal(true);
  };

  const isFormValid = (name, desc) => {
    return name && desc;
  };

  React.useEffect(() => {
    addListeners();
  }, [props]);

  const addListeners = () => {
    let ar = [];
    firebase
      .database()
      .ref("channels")
      .on("child_added", snap => {
        let value = snap.val();
        ar.push(value);
        return setChannels(ar);
      });
  };

  const addChannel = () => {
    const key = firebase
      .database()
      .ref("channels")
      .push().key;
    const ref = firebase.database().ref("channels");

    const newChannel = {
      id: key,
      name: channelName,
      description: channelDesc,
      createdBy: {
        name: props.currentUser.displayName,
        avatar: props.currentUser.photoURL
      }
    };

    ref
      .child(key)
      .update(newChannel)
      .then(() => {
        setChannelDesc("");
        setChannelName("");
        console.log("Channel Added");
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (isFormValid(channelName, channelDesc)) {
      addChannel();
    }
  };

  const changeChannel = chan => {
    setActiveChannel(chan.id);
    dispatch(setCurrentChannel(chan));
  };

  let showChannels = () => {
    if (channels.length > 0) {
      const setFirstChannel = () => {
        const firstChannel = channels[0];
        if (firstLoad && channels.length > 0) {
          dispatch(setCurrentChannel(firstChannel));
          setActiveChannel(firstChannel.id);
          setFirstLoad(false);
        }
      };
      setFirstChannel();
      return channels.map(chan => {
        return (
          <Menu.Item
            key={chan.id}
            onClick={() => changeChannel(chan)}
            style={{ opacity: 0.7 }}
            name={chan.name}
            active={chan.id === activeChannel}
          >
            #{chan.name}
          </Menu.Item>
        );
      });
    }
  };

  return (
    <>
      <Menu.Menu style={{ paddingBottom: "2em" }}>
        <Menu.Item>
          <span>
            <Icon name="exchange" /> CHANNELS
          </span>
          ({channels.length}){" "}
          <Icon style={{ cursor: "pointer" }} name="add" onClick={openModal} />
        </Menu.Item>
        {showChannels()}
      </Menu.Menu>

      <Modal basic open={modal} onClose={closeModal}>
        <Modal.Header>Add a Channel</Modal.Header>
        <Modal.Content>
          <Form onSubmit={handleSubmit}>
            <Form.Field>
              <Input
                fluid
                value={channelName}
                label="Name of Channel"
                name="channelName"
                onChange={e => setChannelName(e.target.value)}
              />
            </Form.Field>
            <Form.Field>
              <Input
                fluid
                value={channelDesc}
                label="Description"
                name="channelDescription"
                onChange={e => setChannelDesc(e.target.value)}
              />
            </Form.Field>
          </Form>
        </Modal.Content>

        <Modal.Actions>
          <Button onClick={handleSubmit} color="green" inverted>
            <Icon name="checkmark" /> Add
          </Button>
          <Button onClick={closeModal} color="red" inverted>
            <Icon name="remove" /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default Channels;
