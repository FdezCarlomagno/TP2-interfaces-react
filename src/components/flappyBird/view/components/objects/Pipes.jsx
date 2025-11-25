import '../../../view/flappyBird.css'
import '../../../view/parallax.css'
import { motion } from 'framer-motion'
import pipeGreen from '../../../../../assets/flappyBird/pipes/pipe-green.png'
import pipeGreenInvertido from '../../../../../assets/flappyBird/pipes/pipe-green-invertido.png'

export default function Pipes({ pipes }) {
    return <>
        {pipes.map((pipe, index) => (
            <div key={index}>
                {/* Tubería superior (invertida) */}
                <motion.div
                    className={`pipe pipe-top`}
                    style={{
                        left: `${pipe.x}px`,
                        top: 0,
                        height: `${pipe.gapTop}px`,
                        '--pipe-bg': `url(${pipeGreenInvertido})`,
                    }}
                    initial={{ scale: 1, filter: 'none' }}
                    animate={pipe.hit ? { scale: 1.06, filter: 'drop-shadow(0 0 10px rgba(255,140,40,0.6))' } : { scale: 1, filter: 'none' }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                />
                {/* Tubería inferior */}
                <motion.div
                    className={`pipe pipe-bottom`}
                    style={{
                        left: `${pipe.x}px`,
                        top: `${pipe.gapBottom}px`,
                        height: `calc(100% - ${pipe.gapBottom}px)`,
                        '--pipe-bg': `url(${pipeGreen})`
                    }}
                    initial={{ scale: 1, filter: 'none' }}
                    animate={pipe.hit ? { scale: 1.06, filter: 'drop-shadow(0 0 10px rgba(255,140,40,0.6))' } : { scale: 1, filter: 'none' }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                />
            </div>
        ))}

    </>
}