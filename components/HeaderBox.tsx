import React from 'react'

const HeaderBox = ({ type = "title", title, subtext, user }: any) => {
    return (
        <div className='header-box text-gray-900 dark:text-gray-100'>
            <h1 className='header-box-title text-gray-900 dark:text-gray-100'>
                {title}
                {type === 'greeting' && (
                    <span className='dark:text-indigo-400'>
                        &nbsp;{user}
                    </span>
                )}
            </h1>
            <p className='header-box-subtext text-gray-700 dark:text-gray-300'>{subtext}</p>
        </div>
    )
}

export default HeaderBox