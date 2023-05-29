import { initializeApollo } from "@/utils/apollo";
import { useMemo } from "react";

export default function useApollo(initialState: any) {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}
