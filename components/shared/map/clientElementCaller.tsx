'use client'

import dynamic from 'next/dynamic';
const DisplayLocationMap = dynamic(() => import('@/components/shared/map/displayLocation'), { ssr: false });

export default function ClientElementCaller({ elementType, elementValue } : {
        elementType : string,
        elementValue: any
}) {
    if (elementType === 'DISPLAYMAP') {
        return (
            
                <DisplayLocationMap coordinates={elementValue} />
        );
    } else {
        return null;
    }
}