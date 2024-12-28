import { faCircleQuestion } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { Button, Heading, Link, Text } from 'react-aria-components';

const InitHeader = ({ title = 'Initiate!', subtitle = 'Creation Games', about = 'This app supports the Simultaneous Initiative system of D20 Tactics by Creation Games. Find out more.' }: { title?: string, subtitle?: string, about?: string }) => {
    const [showAbout, setShowAbout] = useState(false);

    return (
        <header className='flex flex-col items-center w-screen gap-0 p-4 mx-auto bg-gray-500 text-gray-50 max-w-96'>
            <Heading slot='title' level={1} className='flex flex-col items-center w-screen gap-2 p-4 text-2xl'>
                {title}
            </Heading>
            <div>
                <Text slot='subtitle' className='font-bold tracking-widest text-center text-green-400 text-m'>
                    {subtitle}
                </Text>
                <Button onPress={() => setShowAbout(!showAbout)} className='ml-4'>
                    <FontAwesomeIcon icon={faCircleQuestion} scale={.5} className='text-green-400' color='black' />
                </Button>
            </div>
            {showAbout && (
                <div>
                    <Text className='text-center'>
                        <p>
                            {about}
                        </p>
                        <p>
                            <Link href='https://www.creationgames.co/' className='text-blue-400 underline'>Find out more.</Link>
                        </p>
                    </Text>
                </div>
            )}
        </header>
    );
}

export default InitHeader;