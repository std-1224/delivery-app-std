export const isWindow: boolean = typeof window !== 'undefined';

export const resizeFun = (resize: any) => {
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
}