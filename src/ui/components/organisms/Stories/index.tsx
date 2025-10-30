import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';

import { StoryItem } from '../../molecules/StoryItem';

import { styles } from './styles';

import type { Story } from '@/domain/entities/Story';

interface StoriesProps {
  stories: Story[];
}

export const Stories: React.FC<StoriesProps> = ({ stories }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const itemWidth = 80; // Approximate width of each story item including gap

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = itemWidth * 3; // Scroll 3 items at a time
      scrollContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = itemWidth * 3; // Scroll 3 items at a time
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    checkScrollButtons();

    const handleScroll = () => checkScrollButtons();
    const handleResize = () => checkScrollButtons();

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleResize);

      return () => {
        container.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [stories]);

  const allStories = [
    <StoryItem
      key='current-user'
      isCurrentUser={true}
      displayText='Your note'
    />,
    ...stories.map(story => (
      <StoryItem
        key={story.userId}
        userName={story.userName}
        avatarSrc={story.userAvatar}
        showOnlineStatus={true}
        isOnline={story.isOnline}
        displayText={story.userName}
      />
    )),
  ];

  return (
    <div style={styles.container}>
      <div
        style={styles.carouselWrapper}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Left Navigation Button */}
        {canScrollLeft && (
          <button
            onClick={scrollLeft}
            style={{
              ...styles.navButton,
              ...styles.navButtonLeft,
              ...(isHovering ? styles.navButtonVisible : {}),
            }}
            aria-label='Scroll left'
          >
            <LeftOutlined />
          </button>
        )}

        {/* Stories Container */}
        <div
          ref={scrollContainerRef}
          style={{
            ...styles.scrollContainer,
            overflowX: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {allStories}
        </div>

        {/* Right Navigation Button */}
        {canScrollRight && (
          <button
            onClick={scrollRight}
            style={{
              ...styles.navButton,
              ...styles.navButtonRight,
              ...(isHovering ? styles.navButtonVisible : {}),
            }}
            aria-label='Scroll right'
          >
            <RightOutlined />
          </button>
        )}
      </div>
    </div>
  );
};
