import profilePpic from "../../assets/contact-pic.png"

export default function ChatMember({member}) {
    const handleClick = (e) => {
        e.preventDefault();
        console.log(member);
    }

    return (
        <section className="chat-container" onClick={handleClick}>
          <div className="chat-info">
            <img className="profile-pic" src={profilePpic}></img>
            <div className="chat-text-info">
              <h4 className="chat-title text">{member.username}</h4>
            </div>
            {member.isAdmin ? <p className="small-info-text">Admin</p> : null}
          </div>
        </section>
      );
}