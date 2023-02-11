import type { GetServerSidePropsContext } from 'next'
import Link from 'next/link'

interface Props {
  character: {
    name: string;
  };
  factory: {
    name: string;
  };
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return { props: (context.req as any).bootstrap };
}

export default function Bender({character, factory}: Props) {
  return (
    <>
    <div>This is {character.name}&apos;s page</div>
    <div>{character.name} was built at {factory.name}</div>
    <Link href="/fry">Go to Fry&apos;s page</Link>
    </>
  )
}
