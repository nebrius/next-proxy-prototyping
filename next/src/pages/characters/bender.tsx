interface Props {
  character: {
    name: string;
  };
  factory: {
    name: string;
  };
}

export { getServerSideProps } from '../../getServerSideProps'

export default function Bender({character, factory}: Props) {
  return (
    <>
    <div>This is {character.name}&apos;s page</div>
    <div>{character.name} was built at {factory.name}</div>
    {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
    <a href="/characters/fry">Go to Fry&apos;s page</a>
    </>
  )
}
