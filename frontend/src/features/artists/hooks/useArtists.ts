import { useQuery } from '@tanstack/react-query';
import { artistsApi } from '../../products/api';
import { QUERY_KEYS } from '../../../constants';

export function useArtists() {
    return useQuery({
        queryKey: QUERY_KEYS.ARTISTS_LIST,
        queryFn: ({ signal }: { signal: AbortSignal }) => artistsApi.getAll(signal),
    });
}
