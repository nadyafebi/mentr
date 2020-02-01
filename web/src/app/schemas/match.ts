export interface Match {
    id?: string;
    mentee: string;
    mentor: string;
    course: string;
    status: 'pending' | 'accepted' | 'rejected';
}
