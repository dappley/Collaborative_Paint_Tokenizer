import io from 'socket.io-client';
import React from 'react';
import './Canvas.css';

var base64ImageData = null;
class Canvas extends React.Component {
    socket = io.connect("http://localhost:5000");
    artworkTitle = null;
    onlineUserCount;
    roomId = null;
    ctx;

    constructor(props) {
        super(props);
        this.state = { room: this.props.room };
        this.roomId = this.state.room;
        this.artworkTitle = this.state.artworkTitle;
        this.socket.on("canvas-data", function (strokes) {
            var canvas = document.querySelector('#canvas');
            var ctx = canvas.getContext('2d');
            console.log(strokes);
            console.log("I did it");
            strokes.forEach( (data) => {
                ctx.lineWidth = data.lineWidth;
                ctx.lineJoin = data.lineJoin;
                ctx.strokeStyle = data.color;
                ctx.lineCap = data.lineCap;
                ctx.beginPath();
                ctx.moveTo(data.pmx, data.pmy);
                ctx.lineTo(data.mx, data.my);
                ctx.closePath();
                ctx.stroke();
            });
        })
    }

    componentDidMount() {
        this.setup();
        this.drawOnCanvas();
    }

    componentWillReceiveProps(newProps) {
        this.ctx.strokeStyle = newProps.color;
        this.ctx.lineWidth = newProps.size;
    }

    setup() {
        this.socket.on("connect", () => {
            console.log("connected socket id " + this.socket.id + " to server");
            console.log(this.artworkTitle);
            //#TODO artworkTitle is null
            this.socket.emit("createRoom", this.roomId, this.artworkTitle);
        });

        this.socket.on('usercount', this.setuc);
    }

    drawOnCanvas() {
        var canvas = document.querySelector('#canvas');
        this.ctx = canvas.getContext('2d');
        var ctx = this.ctx;
        var sketch = document.querySelector('#sketch');
        var sketch_style = getComputedStyle(sketch);
        canvas.width = parseInt(sketch_style.getPropertyValue('width'));
        canvas.height = parseInt(sketch_style.getPropertyValue('height'));
        var mouse = { x: 0, y: 0 };
        var last_mouse = { x: 0, y: 0 };

        ctx.lineWidth = this.props.size;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.strokeStyle = this.props.color;

        canvas.addEventListener('mousemove', function (e) {
            last_mouse.x = mouse.x;
            last_mouse.y = mouse.y;
            mouse.x = e.pageX - this.offsetLeft;
            mouse.y = e.pageY - this.offsetTop;
        }, false);

        canvas.addEventListener('mousedown', function (e) {
            canvas.addEventListener('mousemove', onPaint, false);
            console.log("listening");
        }, false);

        canvas.addEventListener('mouseup', function () {
            canvas.removeEventListener('mousemove', onPaint, false);
        }, false);

        var root = this;
        var onPaint = function () {
            var strokes = [];
            ctx.beginPath();
            ctx.moveTo(last_mouse.x, last_mouse.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.closePath();
            ctx.stroke();
            let data = {
                mx: mouse.x,
                my: mouse.y,
                pmx: last_mouse.x,
                pmy: last_mouse.y,
                lineWidth: ctx.lineWidth,
                lineJoin: 'round',
                lineCap: 'round',
                color: ctx.strokeStyle
            }
            strokes.push(data);
            base64ImageData = canvas.toDataURL("image/png");
            root.socket.emit("canvas-data", strokes);
        };
    }

    setuc(data) {
        this.onlineUserCount = data.uc;
    }

    render() {
        return (
            <div className="sketch" id="sketch">
                <canvas className="canvas" id="canvas"></canvas>
            </div>
        )
    }
}

export {base64ImageData};
export default Canvas