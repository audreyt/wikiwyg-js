package HTTP::Server::Simple::Static;
use strict;
use warnings;

use File::MMagic ();
use MIME::Types  ();
use URI::Escape  ();
use IO::File     ();
use File::Spec::Functions qw(canonpath);

use base qw(Exporter);
our @EXPORT = qw(serve_static);

our $VERSION = '0.07';

my $mime  = MIME::Types->new();
my $magic = File::MMagic->new();

sub serve_static {
    my ( $self, $cgi, $base ) = @_;
    my $path = $cgi->url( -absolute => 1, -path_info => 1 );

    # Internet Explorer provides the full URI in the GET section
    # of the request header, so remove the protocol, domain name,
    # and port if they exist.
    $path =~ s{^https?://([^/:]+)(:\d+)?/}{/};

    # Sanitize the path and try it.
    $path = $base . canonpath( URI::Escape::uri_unescape($path) );

    my $fh = IO::File->new();
    if ( -f $path && $fh->open($path) ) {
        binmode $fh;
        binmode $self->stdout_handle;

        my $content;
        {
            local $/;
            $content = <$fh>;
        }
        $fh->close;

        my $content_length;
        if ( defined $content ) {
            use bytes;    # Content-Length in bytes, not characters
            $content_length = length $content;
        }
        else {
            $content_length = 0;
            $content        = q{};
        }

        # If a file has no extension, e.g. 'foo' this will return undef
        my $mimeobj = $mime->mimeTypeOf($path);

        my $mimetype;
        if ( defined $mimeobj ) {
            $mimetype = $mimeobj->type;
        }
        else {

            # If the file is empty File::MMagic will give the MIME type as
            # application/octet-stream' which is not helpful and not the
            # way other web servers act. So, we default to 'text/plain'
            # which is the same as apache.

            if ($content_length) {
                $mimetype = $magic->checktype_contents($content);
            }
            else {
                $mimetype = 'text/plain';
            }
        }

        print "HTTP/1.1 200 OK\015\012";
        print 'Content-type: ' . $mimetype . "\015\012";
        print 'Content-length: ' . $content_length . "\015\012\015\012";
        print $content;
        return 1;
    }
    return 0;
}

1;
__END__

=head1 NAME

HTTP::Server::Simple::Static - Serve static files with HTTP::Server::Simple

=head1 VERSION

This documentation refers to HTTP::Server::Simple::Static version 0.07

=head1 SYNOPSIS

    package MyServer;

    use base qw(HTTP::Server::Simple::CGI);
    use HTTP::Server::Simple::Static;

    sub handle_request {
	my ( $self, $cgi ) = @_;
	return $self->serve_static( $cgi, $webroot );
    }

    package main;

    my $server = MyServer->new();
    $server->run();

=head1 DESCRIPTION

this mixin adds a method to serve static files from your HTTP::Server::Simple
subclass.


=head1 SUBROUTINES/METHODS

=over 4

=item  serve_static

Takes a base directory and a web path, and tries to serve a static
file. Returns 0 if the file does not exist, returns 1 on success.

=back

=head1 BUGS AND LIMITATIONS

Bugs or wishlist requests should be submitted via http://rt.cpan.org/

=head1 SEE ALSO

=head1 AUTHOR

Stephen Quinney C<sjq-perl@jadevine.org.uk>

Thanks to Marcus Ramberg C<marcus@thefeed.no> and Simon Cozens for
initial implementation.

=head1 LICENSE AND COPYRIGHT

Copyright 2006 - 2008. Stephen Quinney C<sjq-perl@jadevine.org.uk>

You may distribute this code under the same terms as Perl itself.

=cut
