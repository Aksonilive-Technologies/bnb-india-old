import React from 'react'
import { DatePicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';


const SmallCalender = ({ updateduser, setUpdatedUser }: any) => {
    return (
        <div>
            <DatePicker
                oneTap
                style={{ width: '100%' }}
                value={updateduser.dob ? new Date(updateduser.dob) : null}
                onChange={(date) => setUpdatedUser({ ...updateduser, dob: date ? date.toISOString() : null })}
            />
        </div>
    )
}

export default SmallCalender 