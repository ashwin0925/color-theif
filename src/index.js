import React from "react"
import ReactDOM from "react-dom"
import './index.css'

import ColorThief from './ColorThief'
import image1 from './assets/img1.jpg'
// import image2 from './assets/img2.jpg'
import closeSvg from './assets/close5.png'

class App extends React.Component {
  constructor(props) {
    super(props)

    this.colors = {}
    this.palettes = {}
    this.state = {
      colors: this.colors,
      palettes: this.palettes,
    }

    this.colorThief = new ColorThief()
  }

  thiefColor(img, index) {
    const result = this.colorThief.getColorAsync(img).then(data => {
      const rgb = this.colorThief.convertColorRgb(data)
      this.colors[index] = rgb
      this.setState({ colors: this.colors })
    })
  }

  thiefPalette(index) {
    const data = this.colorThief.getPalette(this[`$img${index}`], 6)
    data.shift()
    const rgb = this.colorThief.convertColorRgb(data)
    this.palettes[index] = rgb
    this.setState({ palettes: this.palettes })
  }

  getItem(img, index, color, palette = []) {
    !color && this.thiefColor(img, index)

    return (
      <div className='itemRoot' key={`img-${index}`}>

        <img
          ref={dom => { this[`$img${index}`] = dom }}
          src={img}
          onLoad={() => this.thiefPalette(index)}
          alt="image1" />
        {index === 3 && [
          <div
            key='closeBtn'
            className='close'
            style={{ backgroundImage: `url(${closeSvg})` }}
            onClick={() => this.setState({ localUrl: '' })}
          ></div>,
          <div key='mask' className='mask'></div>
        ]}
        <div className='mes'>
          <div className='mesTop'>
            <div className='mesTitle'></div>
            <div className='topBlock' style={{ background: color }}>{color}</div>
          </div>
          <div className='mesBottom'>
            <div className='mesTitle'></div>
            {
              palette.map((p, i) => {
                return (
                  <div
                    key={`palette-${i}`}
                    className='bottomBlock'
                    style={{ background: p }}
                  >{p}</div>
                )
              })
            }
          </div>
        </div>
      </div>
    )
  }

  preventDefault = evt => {
    evt.preventDefault()
    evt.stopPropagation()
  }

  onDrop = evt => {
    this.preventDefault(evt)
    const files = evt.dataTransfer.files
    const localUrl = window.URL.createObjectURL(files[0])

    this.setState({ localUrl })
  }

  onInput = evt => {
    this.$input.click(evt)
  }

  onChange = evt => {
    const files = evt.target.files
    const localUrl = window.URL.createObjectURL(files[0])

    this.setState({ localUrl })
  }

  render() {
    const { colors, palettes, localUrl } = this.state

    return (
      <div className='root'>
        <div className='head'>
          <div className='title'>Color Thief</div>
          <div className='desc'>Grabbing the colors from an image </div>
        </div>
        {
          [image1].map((demo, index) => {
            return this.getItem(demo, index, colors[index], palettes[index])
          })
        }
        {localUrl ?
          this.getItem(localUrl, 3, colors[3], palettes[3]) :
          <div className='itemRoot'>
            <input ref={dom => { this.$input = dom }} className='input' type='file' onChange={this.onChange} />
            <div
              className='userInput'
              onDragEnter={this.preventDefault}
              onDragOver={this.preventDefault}
              onDrop={this.onDrop}
              onClick={this.onInput}
            >Drag or Drop images here</div>
          </div>
        }
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))