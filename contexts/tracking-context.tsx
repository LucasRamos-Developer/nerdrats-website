"use client"

import { createContext, useContext, useReducer, useCallback, ReactNode } from "react"

interface TrackingState {
    isTracking: boolean
    distance: number
    keydowns: number
    sessionStart: number | null
    sessionDuration: number
}

type TrackingAction =
    | { type: "START_TRACKING" }
    | { type: "PAUSE_TRACKING" }
    | { type: "STOP_TRACKING" }
    | { type: "UPDATE_DISTANCE"; payload: number }
    | { type: "UPDATE_KEYDOWNS"; payload: number }
    | { type: "UPDATE_DURATION"; payload: number }

const initialState: TrackingState = {
    isTracking: false,
    distance: 0,
    keydowns: 0,
    sessionStart: null,
    sessionDuration: 0,
}

const TrackingContext = createContext<{
    state: TrackingState
    startTracking: () => void
    pauseTracking: () => void
    stopTracking: () => void
    updateDistance: (distance: number) => void
    updateKeydowns: (keydowns: number) => void
    updateDuration: (duration: number) => void
} | null>(null)

function trackingReducer(state: TrackingState, action: TrackingAction): TrackingState {
    switch (action.type) {
        case "START_TRACKING":
            return {
                ...state,
                isTracking: true,
                sessionStart: state.sessionStart || Date.now(),
            }
        case "PAUSE_TRACKING":
            return {
                ...state,
                isTracking: false,
            }
        case "STOP_TRACKING":
            return {
                ...initialState,
            }
        case "UPDATE_DISTANCE":
            return {
                ...state,
                distance: state.distance + action.payload,
            }
        case "UPDATE_KEYDOWNS":
            return {
                ...state,
                keydowns: state.keydowns + action.payload,
            }
        case "UPDATE_DURATION":
            return {
                ...state,
                sessionDuration: action.payload,
            }
        default:
            return state
    }
}

export function TrackingProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(trackingReducer, initialState)

    const startTracking = useCallback(() => {
        dispatch({ type: "START_TRACKING" })
    }, [])

    const pauseTracking = useCallback(() => {
        dispatch({ type: "PAUSE_TRACKING" })
    }, [])

    const stopTracking = useCallback(() => {
        dispatch({ type: "STOP_TRACKING" })
    }, [])

    const updateDistance = useCallback((distance: number) => {
        dispatch({ type: "UPDATE_DISTANCE", payload: distance })
    }, [])

    const updateKeydowns = useCallback((keydowns: number) => {
        dispatch({ type: "UPDATE_KEYDOWNS", payload: keydowns })
    }, [])

    const updateDuration = useCallback((duration: number) => {
        dispatch({ type: "UPDATE_DURATION", payload: duration })
    }, [])

    return (
        <TrackingContext.Provider
            value={{
                state,
                startTracking,
                pauseTracking,
                stopTracking,
                updateDistance,
                updateKeydowns,
                updateDuration,
            }}
        >
            {children}
        </TrackingContext.Provider>
    )
}

export function useTracking() {
    const context = useContext(TrackingContext)
    if (!context) {
        throw new Error("useTracking must be used within a TrackingProvider")
    }
    return context
}