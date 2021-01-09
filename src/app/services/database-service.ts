import { Injectable } from "@angular/core";
import { SourceRepository } from "../storage/firestore/SourceRepository";
import Source from "src/app/data/Source";

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor (
    private sourceRepository: SourceRepository,
  ) {}

  // Source



}
