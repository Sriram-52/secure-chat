import { Session } from "../models";

interface SessionStore {
	findSession(sessionId: string): Session | undefined;
	saveSession(session: Session): void;
	findAllSessions(): Session[];
}

export class InMemorySessionStore implements SessionStore {
	sessions: Map<string, Session> = new Map();

	findSession(sessionId: string): Session | undefined {
		return this.sessions.get(sessionId);
	}

	saveSession(session: Session): void {
		this.sessions.set(session.id, session);
	}

	findAllSessions(): Session[] {
		return Array.from(this.sessions.values());
	}
}
