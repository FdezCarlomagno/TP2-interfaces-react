import { useCallback } from "react";

export default function useCanvas(
    canvasRef,
    imgRef,
    devicePixelRatioRef,
    level,
    isCompleted,
    showCleanImage,
    rotations,
    size,
    gameCompleted,
    showLevelPreview,
    finalPreviewImage
){
     const applyPixelFilter = (imageData, lvl) => {
            const data = imageData.data;
            const len = data.length;
            const grayscale = (i) => {
                const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                data[i] = data[i + 1] = data[i + 2] = avg;
            };
            const invert = (i) => {
                data[i] = 255 - data[i];
                data[i + 1] = 255 - data[i + 1];
                data[i + 2] = 255 - data[i + 2];
            };
            const posterize = (i, steps = 4) => {
                const f = 255 / (steps - 1);
                data[i] = Math.round(data[i] / f) * f;
                data[i + 1] = Math.round(data[i + 1] / f) * f;
                data[i + 2] = Math.round(data[i + 2] / f) * f;
            };
    
            if (lvl === 0) return;
            if (lvl % 6 === 1) for (let i = 0; i < len; i += 4) grayscale(i);
            if (lvl % 6 === 2) for (let i = 0; i < len; i += 4) invert(i);
            if (lvl % 6 === 3) for (let i = 0; i < len; i += 4) posterize(i, 3);
            if (lvl % 6 === 4)
                for (let i = 0; i < len; i += 4) {
                    data[i] *= 0.8;
                    data[i + 1] *= 0.9;
                }
            if (lvl % 6 === 5)
                for (let i = 0; i < len; i += 4) {
                    data[i + 2] = Math.min(255, data[i + 2] + 40);
                }
        };
    
        const draw = useCallback(() => {
            const canvas = canvasRef.current;
            const img = imgRef.current;
            if (!canvas || !img) return;
            const ctx = canvas.getContext("2d");
            const dpr = devicePixelRatioRef.current;
            const w = size;
            const h = size;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            canvas.style.width = `${w}px`;
            canvas.style.height = `${h}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, w, h);
    
            const side = Math.min(img.width, img.height);
            const sx = (img.width - side) / 2;
            const sy = (img.height - side) / 2;
            const cellW = w / 2;
            const cellH = h / 2;
            const srcCellW = side / 2;
            const srcCellH = side / 2;
    
            const quadrants = [
                { sx, sy, dx: 0, dy: 0 },
                { sx: sx + srcCellW, sy, dx: cellW, dy: 0 },
                { sx, sy: sy + srcCellH, dx: 0, dy: cellH },
                { sx: sx + srcCellW, sy: sy + srcCellH, dx: cellW, dy: cellH },
            ];
    
            quadrants.forEach((q, idx) => {
                const rot = (rotations[idx] || 0) * (Math.PI / 180);
                const cx = q.dx + cellW / 2;
                const cy = q.dy + cellH / 2;
                ctx.save();
                ctx.translate(cx, cy);
                ctx.rotate(rot);
                ctx.drawImage(
                    img,
                    q.sx,
                    q.sy,
                    srcCellW,
                    srcCellH,
                    -cellW / 2,
                    -cellH / 2,
                    cellW,
                    cellH
                );
                ctx.restore();
            });
    
            if (level > 0 && !isCompleted && !showCleanImage) {
                const imageData = ctx.getImageData(0, 0, w, h);
                applyPixelFilter(imageData, level);
                ctx.putImageData(imageData, 0, 0);
            }
        }, [rotations, level, size, isCompleted, showCleanImage]);
    
        const getCanvasClassName = () => {
            let className = "blocka-canvas";
            if (isCompleted) className += " completed";
            if (gameCompleted) className += " game-finished";
            if (showLevelPreview || finalPreviewImage) className += " hidden";
            return className;
        };
    

    return {
        getCanvasClassName,
        draw,
        applyPixelFilter
    }
}