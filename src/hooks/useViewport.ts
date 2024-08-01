import { pixBreakpoints } from '@psycron/theme/media-queries/mediaQueries';
import { useMediaQuery } from 'react-responsive';

const useViewport = () => {
  const isMobile = useMediaQuery({ maxWidth: pixBreakpoints.mobile }); // Up to 767px
  const isTablet = useMediaQuery({
    minWidth: pixBreakpoints.mobile + 1,
    maxWidth: pixBreakpoints.tablet,
  }); // 768px to 1023px
  const isMedium = useMediaQuery({
    minWidth: pixBreakpoints.tablet + 1,
    maxWidth: pixBreakpoints.medium,
  }); // 1024px to 1439px
  const isLarge = useMediaQuery({ minWidth: pixBreakpoints.large }); // 1440px and above

  const isSmallerThanTablet = useMediaQuery({
    maxWidth: pixBreakpoints.tablet,
  }); // Up to 1023px
  const isSmallerThanMedium = useMediaQuery({
    maxWidth: pixBreakpoints.medium,
  }); // Up to 1439px
  const isBiggerThanTablet = useMediaQuery({
    minWidth: pixBreakpoints.mobile + 1,
  }); // 768px and above
  const isBiggerThanMedium = useMediaQuery({
    minWidth: pixBreakpoints.tablet + 1,
  }); // 1024px and above

  return {
    isMobile,
    isTablet,
    isMedium,
    isLarge,
    isSmallerThanTablet,
    isSmallerThanMedium,
    isBiggerThanTablet,
    isBiggerThanMedium,
  };
};

export default useViewport;
