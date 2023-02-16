interface Props {
  character: {
    name: string;
  };
}

export { getServerSideProps } from '../../getServerSideProps'

export default function Fry({ character }: Props) {
  return (
    <>
    <div>This is {character.name}&apos;s page</div>
    {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
    <a href="/characters/bender">Go to Bender&apos;s page</a>
    </>
  )
}
