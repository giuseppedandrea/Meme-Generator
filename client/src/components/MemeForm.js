import { Row, Col, Form, Button } from 'react-bootstrap';
import { Redirect, useLocation } from 'react-router-dom';
import { useState } from 'react';
import MemePreview from './MemePreview';

function MemeForm(props) {
  const location = useLocation();
  const [template, setTemplate] = useState(location.state ? props.templates.find((t) => (t.id === location.state.templateId)) : props.templates[0]);
  const [title, setTitle] = useState(location.state ? location.state.title : "");
  const [isPublic, setIsPublic] = useState(location.state ? !!location.state.isPublic : false);
  const [font, setFont] = useState(location.state ? props.fonts.find((f) => (f.id === location.state.fontId)) : props.fonts[0]);
  const [color, setColor] = useState(location.state ? props.colors.find((c) => (c.id === location.state.colorId)) : props.colors[0]);
  const [text1, setText1] = useState(location.state ? location.state.text1 : "");
  const [text2, setText2] = useState(location.state ? location.state.text2 : "");
  const [text3, setText3] = useState(location.state ? location.state.text3 : "");
  const [errorTitle, setErrorTitle] = useState("");
  const [errorText, setErrorText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleChangeTemplate = (event) => {
    if (errorTitle) setErrorTitle("");
    if (errorText) setErrorText("");
    const template = props.templates.find((t) => (t.id === parseInt(event.target.value)));
    if (template) setTemplate(template);
  }

  const handleChangeTitle = (event) => {
    if (errorTitle) setErrorTitle("");
    setTitle(event.target.value);
  }

  const handleChangeVisibility = (event) => {
    setIsPublic(!!parseInt(event.target.value));
  }

  const handleChangeFont = (event) => {
    const font = props.fonts.find((f) => (f.id === parseInt(event.target.value)));
    if (font) setFont(font);
  }

  const handleChangeColor = (event) => {
    const color = props.colors.find((c) => (c.id === parseInt(event.target.value)));
    if (color) setColor(color);
  }

  const handleChangeText1 = (event) => {
    if (errorText) setErrorText("");
    setText1(event.target.value);
  }

  const handleChangeText2 = (event) => {
    if (errorText) setErrorText("");
    setText2(event.target.value);
  }

  const handleChangeText3 = (event) => {
    if (errorText) setErrorText("");
    setText3(event.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    let validForm = true;
    if (title === "") {
      setErrorTitle("Please insert a title");
      validForm = false;
    }

    if (template.textArea1 && !template.textArea2 && !template.textArea3) {
      if (text1 === "") {
        setErrorText("Please insert a text");
        validForm = false;
      }
    }
    if (template.textArea1 && template.textArea2 && !template.textArea3) {
      if ((text1 === "") && (text2 === "")) {
        setErrorText("Please insert at least one text");
        validForm = false;
      }
    }
    if (template.textArea1 && template.textArea2 && template.textArea3) {
      if ((text1 === "") && (text2 === "") && (text3 === "")) {
        setErrorText("Please insert at least one text");
        validForm = false;
      }
    }

    if (validForm) {
      const meme = { templateId: template.id, userId: props.user.id, title: title, isPublic: isPublic, fontId: font.id, colorId: color.id, text1: text1, text2: template.textArea2 ? text2 : null, text3: template.textArea3 ? text3 : null };

      props.addMeme(meme);

      setSubmitted(true);
    }
  }

  return (
    <>
      {submitted ? <Redirect to="/" /> :
        <Row className="pt-nav">
          <Col md={10} className="mx-auto py-3">
            <div className="d-flex justify-content-center">
              <h2>Add a new meme</h2>
            </div>
            <Form>
              <Row>
                <Col md={7}>
                  <Form.Group as={Row} controlId="controlTemplate">
                    <Form.Label column sm={2}>Image</Form.Label>
                    <Col sm={10}>
                      <Form.Control as="select" value={template.id} onChange={handleChangeTemplate} disabled={location.state}>
                        {props.templates.map((t) => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </Form.Control>
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} controlId="controlTitle">
                    <Form.Label column sm={2}>Title</Form.Label>
                    <Col sm={10}>
                      <Form.Control type="text" placeholder="Enter a title..." isInvalid={errorTitle} value={title} onChange={handleChangeTitle} />
                      <Form.Control.Feedback type="invalid">{errorTitle}</Form.Control.Feedback>
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} controlId="controlVisibility">
                    <Form.Label column sm={2}>Visibility</Form.Label>
                    <Col sm={10}>
                      <Form.Check type="radio" id="controlVisibility1" name="visibility" value={1} checked={isPublic} label="Public" onChange={handleChangeVisibility} disabled={location.state && location.state.userId !== props.user.id && !location.state.isPublic} />
                      <Form.Check type="radio" id="controlVisibility2" name="visibility" value={0} checked={!isPublic} label="Protected" onChange={handleChangeVisibility} disabled={location.state && location.state.userId !== props.user.id && !location.state.isPublic} />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} controlId="controlFont">
                    <Form.Label column sm={2}>Text Font</Form.Label>
                    <Col sm={10}>
                      <Form.Control as="select" value={font.id} onChange={handleChangeFont}>
                        {props.fonts.map((f) => (
                          <option key={f.id} value={f.id}>{f.fontFamily}</option>
                        ))}
                      </Form.Control>
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} controlId="controlColor">
                    <Form.Label column sm={2}>Text Color</Form.Label>
                    <Col sm={10}>
                      <Form.Control as="select" value={color.id} onChange={handleChangeColor}>
                        {props.colors.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </Form.Control>
                    </Col>
                  </Form.Group>

                  {
                    template.textArea1 &&
                    <Form.Group as={Row} controlId="controlTextarea1">
                      <Form.Label column sm={2}>Text #1</Form.Label>
                      <Col sm={10}>
                        <Form.Control as="textarea" rows={2} isInvalid={errorText} value={text1} onChange={handleChangeText1} />
                        <Form.Control.Feedback type="invalid">{errorText}</Form.Control.Feedback>
                      </Col>
                    </Form.Group>
                  }

                  {
                    template.textArea2 &&
                    <Form.Group as={Row} controlId="controlTextarea2">
                      <Form.Label column sm={2}>Text #2</Form.Label>
                      <Col sm={10}>
                        <Form.Control as="textarea" rows={2} isInvalid={errorText} value={text2} onChange={handleChangeText2} />
                        <Form.Control.Feedback type="invalid">{errorText}</Form.Control.Feedback>
                      </Col>
                    </Form.Group>

                  }

                  {
                    template.textArea3 &&
                    <Form.Group as={Row} controlId="controlTextarea3">
                      <Form.Label column sm={2}>Text #3</Form.Label>
                      <Col sm={10}>
                        <Form.Control as="textarea" rows={2} isInvalid={errorText} value={text3} onChange={handleChangeText3} />
                        <Form.Control.Feedback type="invalid">{errorText}</Form.Control.Feedback>
                      </Col>
                    </Form.Group>
                  }

                  <Form.Group as={Row}>
                    <Col className={"d-flex justify-content-center py-2"}>
                      <Button variant="success" type="submit" onClick={handleSubmit}>
                        Add
                      </Button>
                    </Col>
                  </Form.Group>
                </Col>
                <Col md={5}>
                  <div className="d-flex justify-content-center">
                    <b>Meme Preview</b>
                  </div>
                  <MemePreview
                    template={template}
                    font={font}
                    color={color}
                    text1={text1}
                    text2={text2}
                    text3={text3}
                    width={"450px"}
                    height={"auto"} />
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      }
    </>
  );
}

export default MemeForm;
