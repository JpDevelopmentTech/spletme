import { motion } from 'framer-motion';

export default function Title({title, subtitle}: {title: string, subtitle?: string}) {
  return (
    <div className="flex flex-col space-y-1 overflow-hidden">
      <motion.span 
        className="text-lg font-semibold tracking-tight"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {title}
      </motion.span>
      
      {subtitle && (
        <motion.span 
          className="text-sm text-gray-500 dark:text-gray-400"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {subtitle}
        </motion.span>
      )}
    </div>
  );
}
