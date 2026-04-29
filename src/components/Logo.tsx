import { motion } from 'framer-motion';
// import logo from '../../public/images/skillitiq-logo.png';

const logo = "/images/skillitiq-logo.png";
/**
 * SKILLITIQ Logo — loads /public/logo.png with smooth animations.
 */
export default function Logo({ size = 60 }: { size?: number }) {
  return (
    <motion.div
      whileHover={{ scale: 1.12, rotate: [0, -5, 5, -3, 3, 0] }}
      transition={{ duration: 0.6 }}
      className="relative inline-flex items-center justify-center select-none"
      style={{ width: size, height: size }}
    >
      {/* Glow */}
      <motion.div
        animate={{ opacity: [0.3, 0.65, 0.3], scale: [0.95, 1.12, 0.95] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 rounded-full blur-xl"
        style={{
          background:
            'radial-gradient(circle, rgba(99,102,241,0.55), rgba(168,85,247,0.3) 50%, transparent 80%)',
        }}
      />

      {/* Image */}
      <motion.img
        src="/images/skillitiq-logo.png"
        alt="SKILLITIQ"
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="relative z-10 object-contain w-full h-full"
        style={{ filter: 'drop-shadow(0 4px 8px rgba(99,102,241,0.4))' }}
      />
    </motion.div>
  );
}