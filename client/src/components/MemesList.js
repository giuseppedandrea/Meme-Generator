import { Container, Row, Col, ListGroup, Button, Spinner, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { BsFillPersonFill, BsFillLockFill, BsFiles, BsTrash } from 'react-icons/bs';
import MemePreview from './MemePreview';

function MemesList(props) {
  return (
    <>
      {/* Memes List */}
      <Row className="pt-nav">
        <Col md={10} className="mx-auto py-3">
          <div className="d-flex justify-content-center">
            <h2>Memes List</h2>
          </div>
          {
            props.loading
              ? <div className="d-flex justify-content-center align-items-center"><Spinner variant="primary" animation="border" role="status" className="mr-2"><span className="sr-only">Loading...</span></Spinner>Loading...</div>
              : !props.memes.length
                ? <span>No memes</span>
                : <ListGroup>
                  {props.memes.sort((m1, m2) => { return ((m1.id < 0 || m2.id < 0) ? (m1.id - m2.id) : (m2.id - m1.id)) }).map((meme) => (
                    <MemeItem
                      key={meme.id}
                      meme={meme}
                      template={props.templates.find((template) => (template.id === meme.templateId))}
                      font={props.fonts.find((font) => (font.id === meme.fontId))}
                      color={props.colors.find((color) => (color.id === meme.colorId))}
                      deleteMeme={props.deleteMeme}
                      loggedIn={props.loggedIn}
                      user={props.user}
                    />
                  ))}
                </ListGroup>
          }
        </Col>
      </Row>
      {/* Meme Add Button */}
      {props.loggedIn &&
        <Link to="/add">
          <Button variant="success" size="lg" className="rounded-circle fixed-bottom-right m-4">
            +
          </Button>
        </Link>
      }
    </>
  );
}

function MemeItem(props) {
  const [modalShow, setModalShow] = useState(false);

  const handleModalShow = () => {
    setModalShow(true);
  };

  const handleModalClose = () => {
    setModalShow(false);
  };

  return (
    <>
      <ListGroup.Item variant={props.meme.statusVariant} as={"div"} role={"button"} action onClick={handleModalShow}>
        <div className="d-flex justify-content-between">
          <div className="align-self-center d-flex align-items-center">
            {(props.meme.userId === props.user.id) && <BsFillPersonFill title={"Own Meme"} className={"mr-2"} />}
            {!props.meme.isPublic && <BsFillLockFill title={"Protected Meme"} className={"mr-2"} />}
            <span>{props.meme.title}</span>
          </div>
          {props.loggedIn &&
            <div className="align-self-center">
              <Link to={{ pathname: "/add", state: { ...props.meme } }}>
                <Button variant="info">
                  <BsFiles title={"Copy Meme"} />
                </Button>
              </Link>
              {(props.meme.userId === props.user.id) &&
                <>
                  {" "}
                  <Button variant="danger" onClick={(event) => { event.stopPropagation(); props.deleteMeme(props.meme); }}>
                    <BsTrash title={"Remove Meme"} />
                  </Button>
                </>
              }
            </div>
          }
        </div>
      </ListGroup.Item>

      <MemeModal show={modalShow} onHide={handleModalClose} meme={props.meme} template={props.template} font={props.font} color={props.color} />
    </>
  );
}

function MemeModal(props) {
  return (
    <Modal show={props.show} onHide={props.onHide} size={"lg"} animation={false} centered={true}>
      <Modal.Header closeButton>
        <Modal.Title>{props.meme.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row>
            <Col>
              <MemePreview
                template={props.template}
                font={props.font}
                color={props.color}
                text1={props.meme.text1}
                text2={props.meme.text2}
                text3={props.meme.text3}
                width={"auto"}
                height={"400px"} />
            </Col>
          </Row>
          <hr />
          <Row>
            <Col>
              <p>
                <span className="font-weight-bold">Creator:</span> {props.meme.userName}
              </p>
              <p>
                <span className="font-weight-bold">Visibility:</span> {props.meme.isPublic ? "Public" : "Protected"}
              </p>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default MemesList;
