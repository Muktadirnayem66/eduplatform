import { doSocialLogin } from '@/app/actions';
import { Button } from '@/components/ui/button';
import Image from 'next/image';


const SocialLogins = () => {
    return (
        <>
         <div className="text-center text-md mt-3 text-gray-500">
        or Signup with
      </div>
      <form action={doSocialLogin}>
        <div className="flex justify-center gap-2">
            <Button
                className="mt-4 py-2 border-gray-600/30 border rounded-md flex items-center gap-2 justify-center"
                type="submit"
                name="action"
                value="google">
            <Image src="/google.png" className='px-1' alt="google" width={40} height={40} />
            <span>Google</span>
            </Button>
            <Button
                className="mt-4 py-2 border-gray-600/30 border rounded-md flex items-center gap-2 justify-center"
                type="submit"
                name="action"
                value="Facebook">
            <Image src="/fb.png" className='px-1' alt="Facebook" width={40} height={40} />
            <span>Facebook</span>
            </Button>
        </div>
      </form>
            
        </>
    );
};

export default SocialLogins;