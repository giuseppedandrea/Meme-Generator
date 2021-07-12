import { useEffect, useState } from 'react';

function MemePreview(props) {
  const [ratio, setRatio] = useState(1.0);

  useEffect(() => {
    if (props.width === "auto") {
      setRatio(parseInt(props.height) / props.template.height);
    } else if (props.height === "auto") {
      setRatio(parseInt(props.width) / props.template.width);
    }
  }, [props.width, props.height, props.template]);

  return (
    <div className="d-flex justify-content-center">
      <div className="meme-container border" style={{
        fontFamily: `${props.font.fontFamily}`,
        fontSize: `${props.font.fontSize}`,
        color: `${props.color.colorHex}`
      }}>
        <img src={props.template.imagePath} alt={props.template.name} width={props.width} height={props.height} />
        {props.template.textArea1 &&
          <div className="meme-textarea d-flex justify-content-center align-items-center" style={{
            left: `${props.template.textArea1.split(";")[0] * ratio}px`,
            top: `${props.template.textArea1.split(";")[1] * ratio}px`,
            width: `${props.template.textArea1.split(";")[2] * ratio}px`,
            height: `${props.template.textArea1.split(";")[3] * ratio}px`,
          }}>
            {props.text1}
          </div>
        }
        {props.template.textArea2 &&
          <div className="meme-textarea d-flex justify-content-center align-items-center" style={{
            left: `${props.template.textArea2.split(";")[0] * ratio}px`,
            top: `${props.template.textArea2.split(";")[1] * ratio}px`,
            width: `${props.template.textArea2.split(";")[2] * ratio}px`,
            height: `${props.template.textArea2.split(";")[3] * ratio}px`,
          }}>
            {props.text2}
          </div>
        }
        {props.template.textArea3 &&
          <div className="meme-textarea d-flex justify-content-center align-items-center" style={{
            left: `${props.template.textArea3.split(";")[0] * ratio}px`,
            top: `${props.template.textArea3.split(";")[1] * ratio}px`,
            width: `${props.template.textArea3.split(";")[2] * ratio}px`,
            height: `${props.template.textArea3.split(";")[3] * ratio}px`,
          }}>
            {props.text3}
          </div>
        }
      </div>
    </div>
  );
}

export default MemePreview;
