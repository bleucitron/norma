export enum State {
	'Attente',
	'Règlement en cours',
	'Inscrit'
}

export enum Role {
	'Leader',
	'Suiveur'
}

export enum Level {
	'Débutant',
	'Confirmé',
	'Expert'
}

export interface Dancer {
	level: Level;
	state: State;
	event: string;
	role: Role;
}

export interface Order {
	order: {
		formSlug: string;
	};
	name: string;
}
