import { IPlace } from '../models/place.interface';

export let Places: IPlace[] = [];

export function addPlace(place: IPlace) {
  Places.push(place);
}

export function getPlaceById(id) {
  Places.filter(place => place.id === id);
}
