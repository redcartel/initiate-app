import { useEffect, useState } from "react";
import { useGetter } from "./useGetter";

export const useGame = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: game, error: gameLoadError, loading: gameLoading } = useGetter<any>('/api/v1/adminGame', { execute: true })

    return { game, gameLoadError, gameLoading }
}