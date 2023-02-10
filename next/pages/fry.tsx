import type { GetServerSidePropsContext } from 'next'
import Link from 'next/link'

interface Props {
  character: {
    name: string;
  };
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const props: Props = {
    character: {
      name: 'Fry'
    },
  }
  return { props };
}

export default function Fry({ character }: Props) {
  return (
    <>
    <div>This is {character.name}&apos;s page</div>
    <Link href="/bender">Go to Bender&apos;s page</Link>
    </>
  )
}
