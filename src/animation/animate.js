import { scale } from "framer-motion";

export const SlideUp = (delay) => {
    return {
        initial: {
            y: 50,
            opacity: 0,
        },
        animate: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                delay,
            },
        },
    };
};



export const SlideDown = (delay) => {
    return {
        initial: {
            y: -150,
            opacity: 0,
        },
        animate: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                delay,
            },
        },
    };
};


export const SlideLeft = (delay) => {
    return {
        initial: {
            x: 50,
            opacity: 0,
        },
        animate: {
            x: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                delay,
            },
        },
    };
};

export const SlideRight = (delay) => {
    return {
        initial: {
            x: -50,
            opacity: 0,
        },
        animate: {
            x: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                delay,
                ease: "easeOut"
            },
        },
    };
};


export const Zooming = (delay) => {
    return {
        initial: {
            scale: 0.5,
        },
        animate: {
            scale: 1,
            transition: {
                duration: 0.5,
                delay,
            },
        },
    };
};


export const SlideMarquee = (direction = 'left', duration = 20) => {
    // Use viewport units for more consistent behavior
    const from = direction === 'left' ? '100vw' : '-100vw';
    const to = direction === 'left' ? '-100vw' : '100vw';

    return {
        initial: { x: from },
        animate: {
            x: to,
            transition: {
                repeat: Infinity,
                duration,
                ease: 'linear',
                repeatType: 'loop',
            },
        },
    };
};
