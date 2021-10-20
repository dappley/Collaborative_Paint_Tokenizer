import io from 'socket.io-client';
import React from 'react';
import './Canvas.css';

var outsideRoomId = null;
var base64ImageData = null;
class Canvas extends React.Component {
    socket = io.connect("http://localhost:5000");
    onlineUserCount;
    artworkTitle = "";
    roomId = null;
    ctx;

    constructor(props) {
        super(props);
        this.state = { room: this.props.room };
        this.roomId = this.state.room;
        this.artworkTitle = this.state.artworkTitle;
        this.socket.on("canvas-data", function (room, strokes) {
            var canvas = document.querySelector('#canvas');
            var ctx = canvas.getContext('2d');
            strokes.forEach( (data) => {
                ctx.lineWidth = data.lineWidth;
                ctx.lineJoin = data.lineJoin;
                ctx.lineCap = data.lineCap;
                ctx.strokeStyle = data.color;
                ctx.beginPath();
                ctx.moveTo(data.pmx, data.pmy);
                ctx.lineTo(data.mx, data.my);
                ctx.closePath();
                ctx.stroke();
            });
            console.log(strokes);
            console.log(this.onlineUserCount);
        })
    }

    componentDidMount() {
        this.setup();
        this.drawOnCanvas();
    }

    componentWillReceiveProps(newProps) {
        this.ctx.strokeStyle = newProps.color;
        this.ctx.lineWidth = newProps.size;
        //this.roomId = newProps.room;
    }

    setup() {
        let artwork = this.getParameterByName("artwork");
        console.log("artwork=" + artwork);

        this.socket.on("connect", () => {
            console.log("connected socket id " + this.socket.id + " to server");
            this.socket.emit("artwork", artwork, this.roomId, this.artworkTitle);
        });

        this.socket.on('usercount', this.setuc);

        this.socket.on('artworkTitle', (data) => {
            this.artworkTitle = data.artworkTitle;
            console.log("The artwork title is:", this.artworkTitle);
        });
    }

    drawOnCanvas() {
        var canvas = document.querySelector('#canvas');
        this.ctx = canvas.getContext('2d');
        var ctx = this.ctx;
        var tempRoom = this.roomId
        var sketch = document.querySelector('#sketch');
        var sketch_style = getComputedStyle(sketch);
        canvas.width = parseInt(sketch_style.getPropertyValue('width'));
        canvas.height = parseInt(sketch_style.getPropertyValue('height'));
        var mouse = { x: 0, y: 0 };
        var last_mouse = { x: 0, y: 0 };

        /* Drawing on Paint App */
        ctx.lineWidth = this.props.size;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.strokeStyle = this.props.color;

        /* Mouse Capturing Work */
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
            console.log("send canvas is " + tempRoom);
            base64ImageData = canvas.toDataURL("image/png");
            console.log(strokes);
            root.socket.emit("canvas-data", tempRoom, strokes);
        };
    }

    getParameterByName(name, url = window.location.href) { 
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    setuc(data) {
        // console.log(data.uc);
        this.onlineUserCount = data.uc;
        // console.log(this.onlineUserCount);
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