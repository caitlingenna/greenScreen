import React from 'react';
import './GreenScreen.css';

const height = 225;
const width = 325;

export class GreenScreen extends React.Component {
  constructor(props){
    super(props);
    this.greenScreen = this.greenScreen.bind(this);
    this.clear = this.clear.bind(this);
  }
  greenScreen = () => {
    let chromaKey = this.props.chromaKey;
    let image1 = new Image();
    let image2 = new Image();
    image1.src = this.props.image1;
    image2.src = this.props.image2;
    image2.onload = function(){
      //draw images to FG and BG canvases
      const fgCanvas = document.createElement('canvas');
      let fgContxt = fgCanvas.getContext('2d');
      fgCanvas.width = width;
      fgCanvas.height = height;
      fgContxt.drawImage(image1,0,0,image1.width, image1.height, 0, 0, width, height);

      const bgCanvas = document.createElement('canvas');
      let bgContxt = bgCanvas.getContext('2d');
      bgCanvas.width = width;
      bgCanvas.height = height;
      bgContxt.drawImage(image2,0,0,image2.width, image2.height, 0, 0, width, height);

      let newImgData = fgContxt.getImageData(0,0,width,height); // start with FG data for new image
      let backgroundData = bgContxt.getImageData(0,0,width,height);
      let newImgPixels = newImgData.data;
      let backgroundPixels = backgroundData.data;

      for(let i = 0; i < newImgPixels.length; i += 4) { // loop through all pixel data
        const red = newImgPixels[i];
        const green = newImgPixels[i + 1];
        const blue = newImgPixels[i + 2];
        //might use in future: const alpha = newImgPixels[i + 3];

        if(chromaKey === '#009933'){
          if(green > (red+blue)){ // if pixel is green, replace pixel data with BG pixel data in corresponding position
              newImgPixels[i] = backgroundPixels[i];
              newImgPixels[i+1] = backgroundPixels[i+1];
              newImgPixels[i+2] = backgroundPixels[i+2];
              newImgPixels[i+3] = backgroundPixels[i+3];
          }
        }
        else {
          if(blue > (red+green)){ // if pixel is blue, replace pixel data with BG pixel data in corresponding position
              newImgPixels[i] = backgroundPixels[i];
              newImgPixels[i+1] = backgroundPixels[i+1];
              newImgPixels[i+2] = backgroundPixels[i+2];
              newImgPixels[i+3] = backgroundPixels[i+3];
          }
        }
      }
    fgContxt.putImageData(newImgData, 0, 0);
    var finalCanvas = document.getElementById('finalCanvas');
    var finalctx = finalCanvas.getContext('2d');
    finalctx.clearRect(0,0,250,250);
    finalctx.drawImage(fgCanvas,0,0); // draw edited image to canvas
    }

  }
  download = () => {
    let download = document.getElementById('download');
    let img = document.getElementById('finalCanvas').toDataURL('image/jpg', 1.0);
    download.setAttribute('href', img);
  }
  clear = () => { // clears green screen canvas, then calls clear function for FG & BG canvases
    const contxt = this.refs.canvas.getContext('2d');
    contxt.clearRect(0, 0, width, height);
    this.props.clearCanvas();
  }

  render(){
    return(
      <div>
      <canvas ref='canvas' id='finalCanvas' className='FinalCanvas' width={width} height = {height}>
      </canvas>
      <button id='submitButton' className ='SubmitButton'
      onClick={this.greenScreen}>Green Screen Magic!</button>
      <a id="download" download="finalImage.jpg">
        <button className='Button' id='dButton' onClick={this.download} style={{top:'85%',width:'90px'}}>
        Save Image</button>
      </a>
      <button id='clearButton' className='Button' onClick={this.clear} style={{top:'90%'}}>
      Clear Images</button>
      </div>
    );
  }
}
