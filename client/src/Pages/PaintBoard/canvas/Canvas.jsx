import io from 'socket.io-client';
import React from 'react';
import './Canvas.css';

var base64ImageData = null;
var artworkTitle = null;
var roomID = null;

class Canvas extends React.Component {
    socket = io.connect("http://localhost:5000");
    artworkTitle = null;
    roomId = null;
    ctx;

    constructor(props) {
        super(props);
        this.state = { room: this.props.room, artworkTitle: this.props.artworkTitle };
        this.artworkTitle = this.state.artworkTitle;
        artworkTitle = this.state.artworkTitle;
        this.roomId = this.state.room;
        roomID = this.state.room;
        console.log("Room ID from container to canvas:", roomID);
        this.socket.on("canvas-data", function (room_ID, data) {
            console.log("server", room_ID);
            console.log("passed down", roomID);
            if (room_ID === roomID) {
                var canvas = document.querySelector('#canvas');
                var ctx = canvas.getContext('2d');
                ctx.lineWidth = data.lineWidth;
                ctx.lineJoin = data.lineJoin;
                ctx.strokeStyle = data.color;
                ctx.lineCap = data.lineCap;
                ctx.beginPath();
                ctx.moveTo(data.pmx, data.pmy);
                ctx.lineTo(data.mx, data.my);
                ctx.closePath();
                ctx.stroke();
            } else {
                console.log("Room ID does not match!")
            }
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
        let url = this.getRoomIdFromLink();
        console.log("this.roomId:", this.roomId);
        this.socket.on("connect", () => {
            console.log("Connected socket id " + this.socket.id + " to artwork: " + artworkTitle);
            this.socket.emit("createRoom", this.roomId, artworkTitle);
        });
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
        }, false);

        canvas.addEventListener('mouseup', function () {
            canvas.removeEventListener('mousemove', onPaint, false);
        }, false);

        var root = this;
        var onPaint = function () {
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
            base64ImageData = canvas.toDataURL("image/png");
            root.socket.emit("canvas-data", root.roomId, data);
        };
    }

    getRoomIdFromLink(url = window.location.href) {
        return url;
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