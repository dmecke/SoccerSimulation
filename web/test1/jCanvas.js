$.jCanvas.extend({
    name: 'drawPlayer',
    props: {
        strokeWidth: 3,
        rounded: true
    },
    fn: function(ctx, p) {
        ctx.beginPath();
        var angle = p.angle;
//        console.log(angle);
        var posA = [p.x + p.radius * Math.cos(angle / 2), p.y - p.radius * Math.sin(angle / 2)];
        var posB = [p.x + p.radius * Math.cos(angle * 1.8), p.y - p.radius * Math.sin(angle * 1.8)];
        var posC = [p.x + p.radius * Math.cos(angle * 1.2), p.y - p.radius * Math.sin(angle * 1.2)];
//        ctx.moveTo(posA[0], posA[1]);
//        ctx.lineTo(posB[0], posB[1]);
//        ctx.lineTo(posC[0], posC[1]);
//        ctx.lineTo(posA[0], posA[1]);
//        ctx.stroke();
//        ctx.closePath();
        ctx.moveTo(posA[0] - 5, posA[1] - 5);
        ctx.lineTo(posA[0] + 5, posA[1] + 5);
        ctx.moveTo(posA[0] + 5, posA[1] - 5);
        ctx.lineTo(posA[0] - 5, posA[1] + 5);
        ctx.stroke();
        ctx.closePath();
    }
});
