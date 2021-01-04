import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import VertexCategory from 'src/app/data/Canvas/VertexCategory';
import { NetworkService } from 'src/app/services/network-service';

export interface RelationshipDialogData {
  vertex: VertexCategory;
}

@Component({
  selector: 'realtionship-dialog',
  templateUrl: 'relationship-dialog.component.html',
})
export class RelationshipDialog {

  vertexControl = new FormControl({value: '', disabled: this.filteredVertices().length === 0}, [Validators.required]);
  selectedVertex: VertexCategory;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: RelationshipDialogData,
    public dialogRef: MatDialogRef<RelationshipDialog>,
    public networkService: NetworkService
  ) {}

  filteredVertices() {
    let visibleVertices = this.networkService.visibleVertices.filter(vertex => vertex.id !== this.data.vertex.id);
    let currentVertexRelationships = this.networkService.visibleRelationships.get(this.data.vertex.id);
    return visibleVertices.filter(vertex => currentVertexRelationships.every(edge => edge.toVertex !== vertex && edge.fromVertex !== vertex));
  }

  submitForm() {
    if (this.vertexControl.valid) {
      this.networkService.connectVertices(this.data.vertex, this.selectedVertex);
      this.dialogRef.close();
    } else {
      this.vertexControl.markAsDirty();
    }
  }
}