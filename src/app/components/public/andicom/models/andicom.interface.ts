export interface Andicom {
  typeDocument: string;
  document: string;
  name: string;
  attemps: string;
}

export interface PayloadGetAttemps {
  id_type: number;
  id_number: string;
}

export interface GenerateCertificateLinkedIn {
  name: string;
}
