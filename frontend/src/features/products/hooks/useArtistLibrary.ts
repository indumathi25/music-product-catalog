import { useEffect, useState } from 'react';
import { artistsApi } from '../api';
import { ArtistImage } from '../types';
import { useDebounce } from '@/hooks/useDebounce';

export function useArtistLibrary(artistName: string) {
    const debouncedName = useDebounce(artistName.trim(), 400);
    const [images, setImages] = useState<ArtistImage[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!debouncedName) {
            setImages([]);
            return;
        }

        let cancelled = false;

        const fetch = async () => {
            setIsLoading(true);
            try {
                const artist = await artistsApi.searchByName(debouncedName);
                if (!cancelled) {
                    setImages(artist?.images ?? []);
                }
            } catch {
                if (!cancelled) setImages([]);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };

        fetch();

        return () => {
            cancelled = true;
        };
    }, [debouncedName]);

    useEffect(() => {
        if (!artistName.trim()) setImages([]);
    }, [artistName]);

    return { libraryImages: images, isLibraryLoading: isLoading };
}
