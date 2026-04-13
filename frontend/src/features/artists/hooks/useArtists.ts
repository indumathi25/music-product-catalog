import { useQuery } from '@tanstack/react-query';
import { artistsApi } from '../../products/api';
import { QUERY_KEYS } from '../../../constants';

export const ARTISTS_QUERY_KEY = ['artists', 'list'];

export function useArtists() {
    return useQuery({
        queryKey: ARTISTS_QUERY_KEY,
        queryFn: ({ signal }) => artistsApi.getAll(signal),
    });
}
