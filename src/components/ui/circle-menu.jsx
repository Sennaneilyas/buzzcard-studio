'use client';

import { AnimatePresence, motion, useAnimationControls } from 'framer-motion';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const CONSTANTS = {
  itemSize: 42,
  containerSize: 140, // Minimized radius for the circle menu
  openStagger: 0.02,
  closeStagger: 0.07
};

const STYLES = {
  trigger: {
    container:
      'rounded-full flex items-center bg-[#C9A96E] text-[#3B2A22] justify-center cursor-pointer outline-none ring-0 hover:brightness-110 transition-all duration-100 z-50 shadow-md',
    active: 'bg-[#C9A96E]'
  },
  item: {
    container:
      'rounded-full flex items-center justify-center absolute bg-white shadow-lg cursor-pointer hover:scale-110 transition-transform',
    label: 'text-[10px] font-bold text-[#3B2A22] absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-white/90 px-2 py-0.5 rounded-full backdrop-blur-sm shadow-sm'
  }
};

const pointOnCircle = (i, n, r, cx = 0, cy = 0) => {
  // Top half-circle (180 deg to 0 deg). Note: HTML Canvas Y is inverted, so negative Y goes UP.
  const theta = n === 1 ? -Math.PI / 2 : Math.PI + (i * Math.PI) / (n - 1);
  const x = cx + r * Math.cos(theta);
  const y = cy + r * Math.sin(theta);
  return { x, y };
};

const MenuItem = ({ icon, label, href, index, totalItems, isOpen, onClick }) => {
  const { x, y } = pointOnCircle(index, totalItems, CONSTANTS.containerSize / 2);
  const [hovering, setHovering] = useState(false);

  return (
    <a 
      href={href} 
      onClick={onClick}
      target={href && href !== '#' ? "_blank" : "_self"} 
      rel="noopener noreferrer"
      className={STYLES.item.container}
    >
      <motion.button
        animate={{
          x: isOpen ? x : 0,
          y: isOpen ? y : 0
        }}
        whileHover={{
          scale: 1.1,
          transition: {
            duration: 0.1,
            delay: 0
          }
        }}
        transition={{
          delay: isOpen ? index * CONSTANTS.openStagger : index * CONSTANTS.closeStagger,
          type: 'spring',
          stiffness: 300,
          damping: 30
        }}
        style={{
          height: CONSTANTS.itemSize - 2,
          width: CONSTANTS.itemSize - 2
        }}
        className={STYLES.item.container}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {icon}
        {hovering && <p className={STYLES.item.label}>{label}</p>}
      </motion.button>
    </a>
  );
};

const MenuTrigger = ({
  setIsOpen,
  isOpen,
  itemsLength,
  closeAnimationCallback,
  openIcon,
  closeIcon
}) => {
  const animate = useAnimationControls();
  const shakeAnimation = useAnimationControls();

  const scaleTransition = Array.from({ length: itemsLength - 1 })
    .map((_, index) => index + 1)
    .reduce((acc, _, index) => {
      const increasedValue = index * 0.15;
      acc.push(1 + increasedValue);
      return acc;
    }, []);

  const closeAnimation = async () => {
    shakeAnimation.start({
      translateX: [0, 2, -2, 0, 2, -2, 0],
      transition: {
        duration: CONSTANTS.closeStagger,
        ease: 'linear',
        repeat: Infinity,
        repeatType: 'loop'
      }
    });
    for (let i = 0; i < scaleTransition.length; i++) {
      await animate.start({
        height: Math.min(
          CONSTANTS.itemSize * scaleTransition[i],
          CONSTANTS.itemSize + CONSTANTS.itemSize / 2
        ),
        width: Math.min(
          CONSTANTS.itemSize * scaleTransition[i],
          CONSTANTS.itemSize + CONSTANTS.itemSize / 2
        ),
        backgroundColor: `color-mix(in srgb, #C9A96E ${Math.max(
          100 - i * 10,
          40
        )}%, transparent)`,
        transition: {
          duration: CONSTANTS.closeStagger / 2,
          ease: 'linear'
        }
      });
      if (i !== scaleTransition.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, CONSTANTS.closeStagger * 1000));
      }
    }

    shakeAnimation.stop();
    shakeAnimation.start({
      translateX: 0,
      transition: {
        duration: 0
      }
    });

    animate.start({
      height: CONSTANTS.itemSize,
      width: CONSTANTS.itemSize,
      backgroundColor: '#C9A96E',
      transition: {
        duration: 0.1,
        ease: 'backInOut'
      }
    });
  };

  return (
    <motion.div animate={shakeAnimation} className="z-50">
      <motion.button
        animate={animate}
        style={{
          height: CONSTANTS.itemSize,
          width: CONSTANTS.itemSize
        }}
        className={cn(STYLES.trigger.container, isOpen && STYLES.trigger.active)}
        onClick={() => {
          if (isOpen) {
            setIsOpen(false);
            closeAnimationCallback();
            closeAnimation();
          } else {
            setIsOpen(true);
          }
        }}
      >
        <AnimatePresence mode="popLayout">
          {isOpen ? (
            <motion.span
              key="menu-close"
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: 'blur(10px)' }}
              transition={{ duration: 0.2 }}
            >
              {closeIcon}
            </motion.span>
          ) : (
            <motion.span
              key="menu-open"
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: 'blur(10px)' }}
              transition={{ duration: 0.2 }}
            >
              {openIcon}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
};

export const CircleMenu = ({
  items,
  openIcon = <Menu size={18} className="text-[#3B2A22]" />,
  closeIcon = <X size={18} className="text-[#3B2A22]" />
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const animate = useAnimationControls();

  const closeAnimationCallback = async () => {
    await animate.start({
      rotate: -360,
      filter: 'blur(1px)',
      transition: {
        duration: CONSTANTS.closeStagger * (items.length + 2),
        ease: 'linear'
      }
    });
    await animate.start({
      rotate: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0
      }
    });
  };

  return (
    <div
      style={{
        width: CONSTANTS.itemSize,
        height: CONSTANTS.itemSize
      }}
      className="relative flex items-center justify-center place-self-center z-50"
    >
      <MenuTrigger
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        itemsLength={items.length}
        closeAnimationCallback={closeAnimationCallback}
        openIcon={openIcon}
        closeIcon={closeIcon}
      />
      <motion.div
        animate={animate}
        className={cn('absolute inset-0 z-0 flex items-center justify-center')}
      >
        {items.map((item, index) => {
          return (
            <MenuItem
              key={`menu-item-${index}`}
              icon={item.icon}
              label={item.label}
              href={item.href}
              onClick={item.action}
              index={index}
              totalItems={items.length}
              isOpen={isOpen}
            />
          );
        })}
      </motion.div>
    </div>
  );
};
