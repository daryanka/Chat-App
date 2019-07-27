import React from "react";
import mime from "mime-types";
import { Modal, Input, Button, Icon } from "semantic-ui-react";

const FileModal = props => {
  const [file, setFile] = React.useState(null);
  const [authorized, setAuthorized] = React.useState([
    "image/jpeg",
    "image/png"
  ]);

  const addFile = event => {
    const file = event.target.files[0];
    console.log(file);
    if (file) {
      setFile(file);
    }
  };

  const isAuthorized = fileName => {
    if (authorized.includes(mime.lookup(fileName))) {
      return true;
    } else {
      return false;
    }
  };

  const sendFile = () => {
    if (file) {
      if (isAuthorized(file.name)) {
        const metadata = { contentType: mime.lookup(file.name) };
        props.uploadFile(file, metadata);
        props.closeModal();
        clearFile();
      }
    }
  };

  const clearFile = () => {
    setFile(null);
  };

  return (
    <Modal basic open={props.modal} onClose={props.closeModal}>
      <Modal.Header>Select an Image File</Modal.Header>
      <Modal.Content>
        <Input
          onChange={addFile}
          fluid
          label="File types: jpg, png"
          type="file"
          name="file"
        />
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={sendFile} color="green" inverted>
          <Icon name="checkmark" />
          Send
        </Button>
        <Button color="red" inverted onClick={props.closeModal}>
          <Icon name="remove" />
          Cancel
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default FileModal;
