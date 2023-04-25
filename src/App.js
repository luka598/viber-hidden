import React, {useEffect, useState} from 'react';
import './App.css';

// Stitches images
function stitchImages(img1src, img2src){
  // Converts from img source data to Image object
  function loadImage(src){
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.src = src
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error("Failed to load image"))
    })
  }
  // Resolves when canvas is fully rendered
  return new Promise((resolve, reject) => {
    // Waits to convert image src to Image objs
      Promise.all([
      loadImage(img1src),
      loadImage(img2src)
    ]).then(([img1, img2]) => {
      // Init canvas
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      // Init usefull vars
      const w = img1.naturalWidth
      const h_bait = Math.floor(w * (61/25))
      const h_bait_fill = h_bait - img1.naturalHeight
      const h_hidden = Math.floor(img2.naturalHeight / 2)
      const h = img2.naturalHeight + h_bait
      
      // Set canvas width and height
      canvas.width = img1.naturalWidth
      canvas.height = h
    
      // Gets average color of bait image
      ctx.drawImage(img1, 0, 0)
      const px = ctx.getImageData(0, 0, img1.naturalWidth, img1.naturalHeight).data;
      let r = 0, g=0, b=0
      for (let i = 0; i<px.length; i+=4){
        r += px[i]
        g += px[i+1]
        b += px[i+2]
      }
      const pxCount = px.length / 4
      const avgColor = {
        r: Math.round(r / pxCount),
        g: Math.round(g / pxCount),
        b: Math.round(b / pxCount)
      }
      ctx.fillStyle = `rgb(${avgColor.r}, ${avgColor.g}, ${avgColor.b})`

      // Draws final image
      ctx.drawImage(img2, 0, 0, w, img2.naturalHeight)
      ctx.drawImage(img2, 0, h-img2.naturalHeight, w, img2.naturalHeight)
      ctx.fillRect(0, h_hidden, w, h_bait)
      ctx.drawImage(img1, 0, h_hidden+h_bait_fill/2)


      ctx.fillStyle = `rgb(0.5, 0.5, 0.5)`
      ctx.font = "10px serif"
      ctx.fillText("raka.j3bi.ga", 0, 17)

      resolve(canvas.toDataURL())
    })
  })
}

const pximg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEX///+nxBvIAAAACklEQVR4nGNgAAAAAgABSK+kcQAAAABJRU5ErkJggg==";

//TODO: Remove react-image
function App() {
  const [img1, setimg1] = useState(pximg)
  const [img2, setimg2] = useState(pximg)
  const [imgr, setimgr] = useState(pximg)

  useEffect(()=>{
    stitchImages(img1, img2).then(img => setimgr(img))
  }, [img1, img2])

  const handleFileSelect = (e, setimg) => {
    const file = e.target.files[0];

    if (file && file.type.startsWith('image/')){
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = () => {
        setimg(reader.result)
      }
    }
  }

  const handleDownload = (imageUrl) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${Math.round(Date.now() / 1000)}.png`;
    link.click();
  };

  return (
    <div className="App bg-gray-950">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 place-content-evenly min-h-screen w-screen">
        <div className="flex items-center justify-center bg-gray-900 rounded m-5">
          <div className="text-center m-3">
            <label htmlFor="hidden-img" className="relative px-4 py-2 text-white bg-gray-800 hover:bg-gray-700 rounded cursor-pointer ">
              Odaberi bait sliku
            <input id="hidden-img" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" type="file" onChange={(e)=>{handleFileSelect(e, setimg1)}} />
            </label>
            <img className='max-h-80 block mt-3 rounded mx-auto' src={img1} />
          </div>
        </div>

        <div className="flex items-center justify-center bg-gray-900 rounded m-5">
          <div className="text-center m-3">
            <label htmlFor="hidden-img" className="relative px-4 py-2 text-white bg-gray-800 hover:bg-gray-700 rounded cursor-pointer ">
              Odaberi skrivenu sliku
            <input id="hidden-img" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" type="file" onChange={(e)=>{handleFileSelect(e, setimg2)}} />
            </label>
            <img className='max-h-80 block mt-3 rounded mx-auto' src={img2} />
          </div>
        </div>

        <div className="flex items-center justify-center bg-gray-900 rounded m-5">
          <div className="text-center m-3">
            <label htmlFor="hidden-img" className="relative px-4 py-2 text-white bg-gray-800 hover:bg-gray-700 rounded cursor-pointer ">
            Preuzmi
              <input id="hidden-img" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" type="button" onClick={() => handleDownload(imgr)} />
            </label>
            <img className='max-h-80 block mt-3 rounded mx-auto' src={imgr} />
          </div>
        </div>
        
      </div>
      
    </div>
  );
}

export default App;
