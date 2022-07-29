import { useFlag, useFlagsStatus } from '@unleash/proxy-client-react';

export default (flag: string): boolean => {
  const { flagsReady } = useFlagsStatus();
  const isFlagEnabled = useFlag(flag);

  return flagsReady ? isFlagEnabled : false;
};
