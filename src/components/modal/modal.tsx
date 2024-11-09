import { Button, Modal } from "flowbite-react";
import { useState } from "react";

const ModalComponent = ({
  children,
  textButton,
  title,
  action,
}: {
  children?: React.ReactNode;
  textButton?: string;
  title?: string;
  action?: () => void;
}) => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <>
      <Button color="dark" outline onClick={() => setOpenModal(true)}>
        {textButton}
      </Button>

      <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>{title}</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">{children}</div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="dark" onClick={() => {
            action && action();
            setOpenModal(false);
          }}>
            Aceptar
          </Button>
          <Button color="dark" outline onClick={() => setOpenModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalComponent;
